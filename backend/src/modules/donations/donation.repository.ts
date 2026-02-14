import { Types } from 'mongoose';
import { DonationDocument, DonationModel } from './donation.model';
import { buildCursorFilter } from '../../utils/pagination';

export const donationRepository = {
  create: (data: Partial<DonationDocument>) => DonationModel.create(data),
  updateByPaymentIntentId: (paymentIntentId: string, data: Partial<DonationDocument>) =>
    DonationModel.findOneAndUpdate({ paymentIntentId }, data, { new: true }),
  findRecentDonors: (campaignId: string) =>
    DonationModel.find({ campaign: campaignId, status: 'succeeded' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('amount user createdAt donorName donorEmail')
      .lean(),
  findByUser: (userId: string) =>
    DonationModel.find({ user: userId, status: 'succeeded' })
      .sort({ createdAt: -1 })
      .lean(),
  findByUserCursor: (userId: string, limit: number, cursor?: string) => {
    const cursorFilter = buildCursorFilter(cursor, 'desc');
    return DonationModel.find({ user: userId, status: 'succeeded', ...cursorFilter })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
        .populate('campaign', 'title')
      .lean();
  },
  sumTotalDonations: async () => {
    const result = await DonationModel.aggregate([{ $match: { status: 'succeeded' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    return result[0]?.total ?? 0;
  },
  countDistinctDonors: async () =>
    DonationModel.distinct('user', { status: 'succeeded', user: { $ne: null } }).then((list) => list.length),
  countDistinctCampaignsByUser: async (userId: string) =>
    DonationModel.distinct('campaign', { status: 'succeeded', user: userId }).then((list) => list.length),
  aggregateDailyTotals: async (filter: Record<string, unknown>, days: number) => {
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const results = await DonationModel.aggregate([
      { $match: { status: 'succeeded', createdAt: { $gte: start }, ...filter } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return results.map((item) => ({
      date: item._id as string,
      total: item.total as number,
      count: item.count as number
    }));
  },
  aggregateCampaignStats: async (campaignIds: string[]) => {
    if (!campaignIds.length) {
      return [] as Array<{
        campaignId: string;
        total: number;
        donationsCount: number;
        donorsCount: number;
        lastDonationAt?: Date;
      }>;
    }

    const ids = campaignIds.map((id) => new Types.ObjectId(id));
    const results = await DonationModel.aggregate([
      { $match: { status: 'succeeded', campaign: { $in: ids } } },
      {
        $group: {
          _id: '$campaign',
          total: { $sum: '$amount' },
          donationsCount: { $sum: 1 },
          donors: { $addToSet: '$user' },
          lastDonationAt: { $max: '$createdAt' }
        }
      },
      {
        $project: {
          total: 1,
          donationsCount: 1,
          lastDonationAt: 1,
          donorsCount: { $size: { $setDifference: ['$donors', [null]] } }
        }
      }
    ]);

    return results.map((item) => ({
      campaignId: item._id.toString(),
      total: item.total as number,
      donationsCount: item.donationsCount as number,
      donorsCount: item.donorsCount as number,
      lastDonationAt: item.lastDonationAt as Date | undefined
    }));
  },
  findPendingByCampaignIds: (campaignIds: string[], limit = 20) => {
    if (!campaignIds.length) {
      return Promise.resolve([]);
    }

    return DonationModel.find({
      campaign: { $in: campaignIds.map((id) => new Types.ObjectId(id)) },
      status: 'pending',
      paymentProvider: 'cbe'
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('campaign amount transactionId verificationMethod verificationDetails createdAt user')
      .populate('user', 'name email')
      .lean();
  },
  deleteByCampaignIds: (campaignIds: string[]) => {
    if (!campaignIds.length) {
      return Promise.resolve({ deletedCount: 0 });
    }
    return DonationModel.deleteMany({ campaign: { $in: campaignIds.map((id) => new Types.ObjectId(id)) } });
  },
  deleteByUserId: (userId: string) => DonationModel.deleteMany({ user: new Types.ObjectId(userId) }),
  deleteByUserIds: (userIds: string[]) => {
    if (!userIds.length) {
      return Promise.resolve({ deletedCount: 0 });
    }
    return DonationModel.deleteMany({ user: { $in: userIds.map((id) => new Types.ObjectId(id)) } });
  },
  deleteAll: () => DonationModel.deleteMany({})
};
