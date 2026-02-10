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
      .select('amount user createdAt')
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
      .lean();
  },
  sumTotalDonations: async () => {
    const result = await DonationModel.aggregate([{ $match: { status: 'succeeded' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    return result[0]?.total ?? 0;
  },
  countDistinctDonors: async () =>
    DonationModel.distinct('user', { status: 'succeeded', user: { $ne: null } }).then((list) => list.length),
  countDistinctCampaignsByUser: async (userId: string) =>
    DonationModel.distinct('campaign', { status: 'succeeded', user: userId }).then((list) => list.length)
};
