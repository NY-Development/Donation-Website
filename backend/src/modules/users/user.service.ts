import { donationRepository } from '../donations/donation.repository';
import { userRepository } from './user.repository';
import { makeCursor } from '../../utils/pagination';

export const userService = {
  getProfile: async (userId: string) => {
    const user = await userRepository.findByIdLean(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    return user;
  },
  getDashboard: async (userId: string, limit = 20, cursor?: string) => {
    const [donations, user, campaignsSupported] = await Promise.all([
      donationRepository.findByUserCursor(userId, limit, cursor),
      userRepository.findByIdLean(userId),
      donationRepository.countDistinctCampaignsByUser(userId)
    ]);

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const totalDonated = user.totalDonated ?? 0;

    const nextCursor = donations.length
      ? makeCursor(donations[donations.length - 1].createdAt, donations[donations.length - 1]._id.toString())
      : null;

    return {
      totalDonated,
      campaignsSupported,
      nextCursor,
      timeline: donations.map((donation) => ({
        id: donation._id.toString(),
        amount: donation.amount,
        campaign: donation.campaign,
        createdAt: donation.createdAt
      }))
    };
  }
};
