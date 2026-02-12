import { campaignRepository } from '../campaigns/campaign.repository';
import { donationRepository } from '../donations/donation.repository';
import { userRepository } from '../users/user.repository';
import { UserModel } from '../users/user.model';
import { cloudinary } from '../../config/cloudinary';
import { AdminSettingsModel } from './adminSettings.model';

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
  }
};
