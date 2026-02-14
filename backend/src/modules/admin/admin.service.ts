import { campaignRepository } from '../campaigns/campaign.repository';
import { donationRepository } from '../donations/donation.repository';
import { userRepository } from '../users/user.repository';
import { UserModel } from '../users/user.model';
import { cloudinary } from '../../config/cloudinary';
import { AdminSettingsModel } from './adminSettings.model';
import { campaignActionRequestRepository } from '../campaigns/campaignActionRequest.repository';

export const adminService = {
  getOverview: async () => {
    const [totalDonated, donorsCount, campaignsApproved, usersCount] = await Promise.all([
      donationRepository.sumTotalDonations(),
      donationRepository.countDistinctDonors(),
      campaignRepository.countByStatus('approved'),
      userRepository.count()
    ]);

    return {
      totalDonated,
      donorsCount,
      campaignsApproved,
      usersCount
    };
  },
  getTrends: async (days = 7) => {
    const safeDays = Math.min(Math.max(days, 3), 30);
    const series = await donationRepository.aggregateDailyTotals({}, safeDays);

    const start = new Date();
    start.setDate(start.getDate() - (safeDays - 1));
    start.setHours(0, 0, 0, 0);

    const map = new Map(series.map((item) => [item.date, item]));
    const output = [] as typeof series;
    for (let i = 0; i < safeDays; i += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const key = current.toISOString().slice(0, 10);
      const entry = map.get(key);
      output.push({
        date: key,
        total: entry?.total ?? 0,
        count: entry?.count ?? 0
      });
    }

    return output;
  },
  getTopCampaigns: async (limit = 5) => {
    const safeLimit = Math.min(Math.max(limit, 1), 10);
    const campaigns = await campaignRepository.findTopByRaised(safeLimit);
    return campaigns.map((campaign) => ({
      id: campaign._id.toString(),
      title: campaign.title,
      raisedAmount: campaign.raisedAmount,
      goalAmount: campaign.goalAmount,
      category: campaign.category,
      createdAt: campaign.createdAt
    }));
  },
  verifyCampaign: async (campaignId: string, status: 'approved' | 'rejected') => {
    const campaign = await campaignRepository.updateById(campaignId, { status });
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    return campaign;
  },
  getOrganizerVerifications: async () => {
    const users = await UserModel.find({ 'organizerVerification.status': 'pending' })
      .select('name email organizerVerification')
      .lean();

    return users.map((user) => {
      const verification = user.organizerVerification;
      const signUrl = (asset?: { publicId?: string; format?: string }) => {
        if (!asset?.publicId || !asset?.format) {
          return null;
        }
        return cloudinary.utils.url(asset.publicId, {
          type: 'private',
          resource_type: 'image',
          secure: true,
          sign_url: true,
          format: asset.format
        });
      };

      return {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        status: verification?.status ?? 'pending',
        submittedAt: verification?.submittedAt,
        idFrontUrl: signUrl(verification?.idFront),
        idBackUrl: signUrl(verification?.idBack),
        livePhotoUrl: signUrl(verification?.livePhoto)
      };
    });
  },
  getUsers: async (options: {
    search?: string;
    role?: string;
    verification?: 'pending' | 'approved' | 'rejected';
    page?: number;
    limit?: number;
  }) => {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(Math.max(10, options.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (options.role) {
      filter.role = options.role;
    }
    if (options.verification) {
      filter['organizerVerification.status'] = options.verification;
    }
    if (options.search) {
      filter.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select('name email role isOrganizerVerified organizerVerification.status createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(filter)
    ]);

    return {
      data: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isOrganizerVerified: Boolean(user.isOrganizerVerified),
        verificationStatus: user.organizerVerification?.status ?? 'pending',
        createdAt: user.createdAt
      })),
      total,
      page,
      limit
    };
  },
  getSettings: async () => {
    let settings = await AdminSettingsModel.findOne().lean();
    if (!settings) {
      const created = await AdminSettingsModel.create({});
      settings = await AdminSettingsModel.findById(created._id).lean();
    }
    return settings;
  },
  updateSettings: async (payload: Partial<{
    platformName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    platformFeePercent: number;
    settlementCurrency: string;
    enforce2fa: boolean;
    sessionTimeoutMinutes: number;
    auditLogging: boolean;
    notifications: { largeDonation: boolean; newCampaignVerification: boolean };
  }>) => {
    const settings = await AdminSettingsModel.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true
    }).lean();
    return settings;
  },
  approveOrganizer: async (userId: string, adminId: string) => {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        isOrganizerVerified: true,
        organizerVerification: {
          status: 'approved',
          reviewedAt: new Date(),
          reviewedBy: adminId
        }
      },
      { new: true }
    );
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    return user;
  },
  rejectOrganizer: async (userId: string, adminId: string, reason?: string) => {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        isOrganizerVerified: false,
        organizerVerification: {
          status: 'rejected',
          reviewedAt: new Date(),
          reviewedBy: adminId,
          rejectionReason: reason
        }
      },
      { new: true }
    );
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    return user;
  },
  deleteUser: async (userId: string) => {
    const user = await UserModel.findById(userId).select('role');
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    if (user.role === 'admin') {
      throw { status: 403, message: 'Admin accounts cannot be deleted' };
    }

    const campaignIds = await campaignRepository.findIdsByOwnerIds([userId]);
    await donationRepository.deleteByCampaignIds(campaignIds);
    await donationRepository.deleteByUserId(userId);
    await campaignRepository.deleteByOwnerIds([userId]);
    await userRepository.deleteById(userId);

    return { deletedUserId: userId, deletedCampaigns: campaignIds.length };
  },
  deleteAllUsers: async () => {
    const userIds = await UserModel.find({ role: { $ne: 'admin' } }).select('_id').lean();
    const ids = userIds.map((item) => item._id.toString());

    const campaignIds = await campaignRepository.findIdsByOwnerIds(ids);
    await donationRepository.deleteByCampaignIds(campaignIds);
    await donationRepository.deleteByUserIds(ids);
    await campaignRepository.deleteByOwnerIds(ids);
    const userResult = await userRepository.deleteAllExceptAdmins();

    return {
      deletedUsers: userResult.deletedCount ?? 0,
      deletedCampaigns: campaignIds.length
    };
  },
  deleteCampaign: async (campaignId: string) => {
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }

    await donationRepository.deleteByCampaignIds([campaignId]);
    await campaignRepository.deleteById(campaignId);

    return { deletedCampaignId: campaignId };
  },
  deleteAllCampaigns: async () => {
    const donationResult = await donationRepository.deleteAll();
    const campaignResult = await campaignRepository.deleteAll();

    return {
      deletedDonations: donationResult.deletedCount ?? 0,
      deletedCampaigns: campaignResult.deletedCount ?? 0
    };
  },
  getCampaignActionRequests: async (limit = 20) => {
    const requests = await campaignActionRequestRepository.findPending(limit);
    return requests.map((request) => ({
      id: request._id.toString(),
      action: request.action,
      message: request.message,
      createdAt: request.createdAt,
      campaign: request.campaign && typeof request.campaign === 'object'
        ? {
            id: (request.campaign as { _id?: { toString: () => string }; title?: string; status?: string })._id?.toString() ?? '',
            title: (request.campaign as { title?: string }).title ?? 'Campaign',
            status: (request.campaign as { status?: string }).status
          }
        : undefined,
      requestedBy: request.requestedBy && typeof request.requestedBy === 'object'
        ? {
            id: (request.requestedBy as { _id?: { toString: () => string } })._id?.toString() ?? '',
            name: (request.requestedBy as { name?: string }).name ?? 'User',
            email: (request.requestedBy as { email?: string }).email
          }
        : undefined
    }));
  },
  approveCampaignActionRequest: async (requestId: string, adminId: string) => {
    const request = await campaignActionRequestRepository.findById(requestId);
    if (!request) {
      throw { status: 404, message: 'Request not found' };
    }
    if (request.status !== 'pending') {
      throw { status: 400, message: 'Request already processed' };
    }

    const campaignId = request.campaign.toString();
    if (request.action === 'pause') {
      await campaignRepository.updateById(campaignId, { status: 'paused' } as never);
    }
    if (request.action === 'delete') {
      await donationRepository.deleteByCampaignIds([campaignId]);
      await campaignRepository.deleteById(campaignId);
    }

    const updated = await campaignActionRequestRepository.updateStatus(requestId, {
      status: 'approved',
      reviewedBy: adminId,
      reviewedAt: new Date()
    });

    return updated;
  },
  rejectCampaignActionRequest: async (requestId: string, adminId: string, reason?: string) => {
    const request = await campaignActionRequestRepository.findById(requestId);
    if (!request) {
      throw { status: 404, message: 'Request not found' };
    }
    if (request.status !== 'pending') {
      throw { status: 400, message: 'Request already processed' };
    }

    const updated = await campaignActionRequestRepository.updateStatus(requestId, {
      status: 'rejected',
      reviewedBy: adminId,
      reviewedAt: new Date(),
      rejectionReason: reason
    });

    return updated;
  }
};
