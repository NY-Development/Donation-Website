import { FilterQuery } from 'mongoose';
import { CampaignDocument, CampaignModel } from './campaign.model';

export const campaignRepository = {
  create: (data: Partial<CampaignDocument>) => CampaignModel.create(data),
  findById: (id: string) => CampaignModel.findById(id),
  findByIdLean: (id: string) => CampaignModel.findById(id).lean(),
  find: (filter: FilterQuery<CampaignDocument>, limit: number, sort: 'asc' | 'desc', skip = 0) =>
    CampaignModel.find(filter)
      .sort({ createdAt: sort === 'desc' ? -1 : 1, _id: sort === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  updateById: (id: string, data: Partial<CampaignDocument>) =>
    CampaignModel.findByIdAndUpdate(id, data, { new: true }),
  incrementRaisedAmount: (id: string, amount: number) =>
    CampaignModel.findByIdAndUpdate(id, { $inc: { raisedAmount: amount } }, { new: true }),
  countByStatus: (status?: string) => CampaignModel.countDocuments(status ? { status } : {})
};
