import { CampaignActionRequestModel } from './campaignActionRequest.model';

export const campaignActionRequestRepository = {
  create: (data: {
    campaign: string;
    requestedBy: string;
    action: 'pause' | 'delete';
    message: string;
  }) => CampaignActionRequestModel.create(data),
  findPending: (limit = 20) =>
    CampaignActionRequestModel.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('campaign', 'title status')
      .populate('requestedBy', 'name email')
      .lean(),
  findById: (id: string) => CampaignActionRequestModel.findById(id),
  findPendingByCampaignAndAction: (campaignId: string, action: 'pause' | 'delete') =>
    CampaignActionRequestModel.findOne({ campaign: campaignId, action, status: 'pending' }),
  updateStatus: (id: string, data: Partial<{ status: 'approved' | 'rejected'; reviewedBy: string; reviewedAt: Date; rejectionReason?: string }>) =>
    CampaignActionRequestModel.findByIdAndUpdate(id, data, { new: true })
};
