import { FilterQuery } from 'mongoose';
import { CampaignDocument, CampaignModel } from './campaign.model';

export const campaignRepository = {
  create: (data: Partial<CampaignDocument>) => CampaignModel.create(data),
  findById: (id: string) => CampaignModel.findById(id),
  findByIdLean: (id: string) => CampaignModel.findById(id).lean(),
  findByOrganizer: (organizerId: string, limit = 12) =>
    CampaignModel.find({ $or: [{ organizer: organizerId }, { createdBy: organizerId }] })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean(),
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
  ,
  findTopByRaised: (limit: number) =>
    CampaignModel.find({ status: 'approved' })
      .sort({ raisedAmount: -1 })
      .limit(limit)
      .select('title raisedAmount goalAmount category createdAt')
      .lean(),
  findSuccessStories: (limit = 6) =>
    CampaignModel.find({
      $expr: { $gte: ['$raisedAmount', '$goalAmount'] }
    })
      .sort({ goalReachedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean(),
  findIdsByOwnerIds: (ownerIds: string[]) =>
    CampaignModel.find({ $or: [{ organizer: { $in: ownerIds } }, { createdBy: { $in: ownerIds } }] })
      .select('_id')
      .lean()
      .then((items) => items.map((item) => item._id.toString())),
  deleteByOwnerIds: (ownerIds: string[]) =>
    CampaignModel.deleteMany({ $or: [{ organizer: { $in: ownerIds } }, { createdBy: { $in: ownerIds } }] }),
  deleteById: (id: string) => CampaignModel.findByIdAndDelete(id),
  deleteAll: () => CampaignModel.deleteMany({})
};
