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
  },
  getTrends: async (userId: string, days = 7) => {
    const safeDays = Math.min(Math.max(days, 3), 30);
    const series = await donationRepository.aggregateDailyTotals({ user: userId }, safeDays);

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
  }
};
