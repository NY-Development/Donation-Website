import { campaignRepository } from '../campaigns/campaign.repository';
import { donationRepository } from '../donations/donation.repository';
import { userRepository } from '../users/user.repository';
import { UserModel } from '../users/user.model';
import { cloudinary } from '../../config/cloudinary';

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
