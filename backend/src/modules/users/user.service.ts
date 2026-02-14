import { donationRepository } from '../donations/donation.repository';
import { userRepository } from './user.repository';
import { makeCursor } from '../../utils/pagination';
import { campaignRepository } from '../campaigns/campaign.repository';

export const userService = {
  getProfile: async (userId: string) => {
    const user = await userRepository.findByIdLean(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    return user;
  },
  updateProfile: async (userId: string, payload: { name?: string; email?: string }) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    if (payload.email && payload.email !== user.email) {
      const existing = await userRepository.findByEmail(payload.email);
      if (existing && existing._id.toString() !== userId) {
        throw { status: 409, message: 'Email already in use' };
      }
    }

    const updated = await userRepository.updateById(userId, {
      name: payload.name ?? user.name,
      email: payload.email ?? user.email
    });

    if (!updated) {
      throw { status: 404, message: 'User not found' };
    }

    return userRepository.findByIdLean(updated._id.toString());
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
        campaign: typeof donation.campaign === 'string' ? donation.campaign : donation.campaign?._id?.toString(),
        campaignTitle:
          typeof donation.campaign === 'object' && donation.campaign
            ? (donation.campaign as { title?: string }).title
            : undefined,
        campaignData:
          typeof donation.campaign === 'object' && donation.campaign
            ? {
                _id: donation.campaign._id?.toString(),
                title: (donation.campaign as { title?: string }).title
              }
            : undefined,
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
  },
  getMyCampaigns: async (userId: string, limit = 12) => {
    const campaigns = await campaignRepository.findByOrganizer(userId, limit);
    const campaignIds = campaigns.map((campaign) => campaign._id.toString());
    const stats = await donationRepository.aggregateCampaignStats(campaignIds);
    const statsMap = new Map(stats.map((item) => [item.campaignId, item]));

    const summary = campaigns.reduce(
      (acc, campaign) => {
        const progress = campaign.goalAmount > 0 ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0;
        const isActive = campaign.status === 'approved';
        const isSuccess = campaign.raisedAmount >= campaign.goalAmount;

        acc.totalCampaigns += 1;
        acc.totalRaised += campaign.raisedAmount;
        acc.activeCampaigns += isActive ? 1 : 0;
        acc.successStories += isSuccess ? 1 : 0;
        acc.progressTotal += progress;

        return acc;
      },
      { totalCampaigns: 0, totalRaised: 0, activeCampaigns: 0, successStories: 0, progressTotal: 0 }
    );

    const avgProgress = summary.totalCampaigns ? summary.progressTotal / summary.totalCampaigns : 0;

    return {
      summary: {
        totalCampaigns: summary.totalCampaigns,
        activeCampaigns: summary.activeCampaigns,
        successStories: summary.successStories,
        totalRaised: summary.totalRaised,
        avgProgress
      },
      campaigns: campaigns.map((campaign) => {
        const stat = statsMap.get(campaign._id.toString());
        return {
          _id: campaign._id.toString(),
          title: campaign.title,
          category: campaign.category,
          status: campaign.status,
          goalAmount: campaign.goalAmount,
          raisedAmount: campaign.raisedAmount,
          createdAt: campaign.createdAt,
          media: campaign.media ?? [],
          donorsCount: stat?.donorsCount ?? 0,
          lastDonationAt: stat?.lastDonationAt
        };
      })
    };
  },
  getPendingDonations: async (userId: string, limit = 20) => {
    const campaigns = await campaignRepository.findByOrganizer(userId, 50);
    const campaignIds = campaigns.map((campaign) => campaign._id.toString());
    if (!campaignIds.length) {
      return { totalPending: 0, donations: [] };
    }

    const campaignMap = new Map(campaigns.map((campaign) => [campaign._id.toString(), campaign]));
    const donations = await donationRepository.findPendingByCampaignIds(campaignIds, limit);

    const formatted = donations.map((donation) => {
      const campaignId = donation.campaign.toString();
      const campaign = campaignMap.get(campaignId);
      const details = (donation.verificationDetails ?? {}) as {
        donorName?: string;
        screenshotUrl?: string;
      };
      const user = donation.user as { name?: string } | undefined;

      return {
        id: donation._id.toString(),
        campaignId,
        campaignTitle: campaign?.title ?? 'Campaign',
        amount: donation.amount,
        transactionId: donation.transactionId,
        verificationMethod: donation.verificationMethod,
        screenshotUrl: details.screenshotUrl,
        donorName: details.donorName ?? user?.name,
        createdAt: donation.createdAt
      };
    });

    return { totalPending: formatted.length, donations: formatted };
  }
};
