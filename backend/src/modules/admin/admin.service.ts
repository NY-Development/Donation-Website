import { campaignRepository } from '../campaigns/campaign.repository';
import { donationRepository } from '../donations/donation.repository';
import { userRepository } from '../users/user.repository';

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
  }
};
