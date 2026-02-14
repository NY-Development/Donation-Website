import { cloudinary } from '../../config/cloudinary';
import { Types } from 'mongoose';
import { cache } from '../../utils/cache';
import { buildCursorFilter, makeCursor } from '../../utils/pagination';
import { campaignRepository } from './campaign.repository';
import { campaignActionRequestRepository } from './campaignActionRequest.repository';
import { donationRepository } from '../donations/donation.repository';
import { userRepository } from '../users/user.repository';
import { sendCampaignCreatedEmail } from '../../utils/mailer';

export const campaignService = {
  getFeatured: async () => {
    const cached = await cache.get('campaigns:featured');
    if (cached) {
      return cached;
    }
    const data = await campaignRepository.find({ status: 'approved' }, 6, 'desc');
    await cache.set('campaigns:featured', data, 60);
    return data;
  },
  list: async (query: {
    category?: string;
    location?: string;
    urgent?: string;
    status?: string;
    limit: number;
    page?: number;
    cursor?: string;
    sort: 'asc' | 'desc';
  }) => {
    const filters: Record<string, unknown> = {};
    if (query.status && query.status !== 'all') {
      filters.status = query.status;
    } else if (!query.status) {
      filters.status = 'approved';
    }
    if (query.category) {
      filters.category = query.category;
    }
    if (query.location) {
      filters.location = query.location;
    }
    if (query.urgent) {
      filters.urgent = query.urgent === 'true';
    }

    const cacheKey = `campaigns:list:${JSON.stringify(query)}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      const now = new Date();
      const expiredIds = (cached.data ?? [])
        .filter((campaign: { status?: string; deadline?: Date; _id?: string }) =>
          campaign.status === 'approved' && campaign.deadline && new Date(campaign.deadline) <= now
        )
        .map((campaign: { _id?: string }) => campaign._id)
        .filter(Boolean) as string[];

      if (expiredIds.length) {
        await Promise.all(
          expiredIds.map((campaignId) =>
            campaignRepository.updateById(campaignId, { status: 'closed', closedAt: now })
          )
        );
        cached.data.forEach((campaign: { _id?: string; status?: string; closedAt?: Date }) => {
          if (campaign._id && expiredIds.includes(campaign._id)) {
            campaign.status = 'closed';
            campaign.closedAt = now;
          }
        });
      }

      return cached;
    }

    const usePage = Boolean(query.page) && !query.cursor;
    const cursorFilter = buildCursorFilter(query.cursor, query.sort);
    const page = query.page ?? 1;
    const skip = usePage ? (page - 1) * query.limit : 0;
    const data = await campaignRepository.find({ ...filters, ...cursorFilter }, query.limit, query.sort, skip);
    const now = new Date();
    const expiredIds = data
      .filter((campaign) => campaign.status === 'approved' && campaign.deadline && new Date(campaign.deadline) <= now)
      .map((campaign) => campaign._id.toString());

    if (expiredIds.length) {
      await Promise.all(
        expiredIds.map((campaignId) =>
          campaignRepository.updateById(campaignId, { status: 'closed', closedAt: now })
        )
      );
      data.forEach((campaign) => {
        if (expiredIds.includes(campaign._id.toString())) {
          campaign.status = 'closed';
          campaign.closedAt = now;
        }
      });
    }

    const nextCursor = data.length ? makeCursor(data[data.length - 1].createdAt, data[data.length - 1]._id.toString()) : null;
    const response = { data, nextCursor };
    await cache.set(cacheKey, response, 60);
    return response;
  },
  getSuccessStories: async (limit = 6) => {
    const cacheKey = `campaigns:success:${limit}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const data = await campaignRepository.findSuccessStories(limit);
    await cache.set(cacheKey, data, 120);
    return data;
  },
  getById: async (campaignId: string) => {
    const campaign = await campaignRepository.findByIdLean(campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    const now = new Date();
    if (campaign.status === 'approved' && campaign.deadline && new Date(campaign.deadline) <= now) {
      const updated = await campaignRepository.updateById(campaignId, { status: 'closed', closedAt: now });
      if (updated) {
        return updated.toObject();
      }
    }
    return campaign;
  },
  getDonors: async (campaignId: string) => {
    return donationRepository.findRecentDonors(campaignId);
  },
  createDraft: async (payload: {
    title: string;
    category: string;
    story: string;
    goalAmount: number;
    cbeAccountNumber?: string;
    organizerId: string;
    location?: string;
    urgent?: boolean;
    fundingStyle?: 'keep' | 'all_or_nothing';
    deadline?: Date;
  }) => {
    const campaign = await campaignRepository.create({
      title: payload.title,
      category: payload.category,
      story: payload.story,
      goalAmount: payload.goalAmount,
      cbeAccountNumber: payload.cbeAccountNumber,
      location: payload.location,
      urgent: payload.urgent,
      fundingStyle: payload.fundingStyle ?? 'keep',
      deadline: payload.deadline,
      organizer: new Types.ObjectId(payload.organizerId),
      createdBy: new Types.ObjectId(payload.organizerId),
      status: 'draft'
    });
    const organizer = await userRepository.findByIdLean(payload.organizerId);
    await sendCampaignCreatedEmail({
      title: campaign.title,
      category: campaign.category,
      goalAmount: campaign.goalAmount,
      organizerEmail: organizer?.email
    });
    await cache.invalidateByPrefix('campaigns:list:');
    return campaign;
  },
  updateCampaign: async (campaignId: string, payload: Record<string, unknown>) => {
    const campaign = await campaignRepository.updateById(campaignId, payload);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    await cache.invalidateByPrefix('campaigns:list:');
    return campaign;
  },
  uploadMedia: async (campaignId: string, media: string[]) => {
    const uploads = await Promise.all(
      media.map((item) => cloudinary.uploader.upload(item, { folder: 'campaigns' }))
    );

    const urls = uploads.map((upload) => upload.secure_url);
    const campaign = await campaignRepository.updateById(campaignId, { $push: { media: { $each: urls } } } as never);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    await cache.invalidateByPrefix('campaigns:list:');
    return campaign;
  },
  submitCampaign: async (campaignId: string) => {
    const campaign = await campaignRepository.updateById(campaignId, { status: 'pending_verification' });
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    await cache.invalidateByPrefix('campaigns:list:');
    return campaign;
  },
  getGlobalStats: async () => {
    const cached = await cache.get('stats:global');
    if (cached) {
      return cached;
    }
    const totalDonations = await donationRepository.sumTotalDonations();
    const donorsCount = await donationRepository.countDistinctDonors();
    const campaigns = await campaignRepository.countByStatus('approved');
    const response = {
      totalDonated: totalDonations,
      donorsCount,
      livesImpacted: campaigns
    };
    await cache.set('stats:global', response, 60);
    return response;
  },
  createActionRequest: async (payload: { campaignId: string; userId: string; action: 'pause' | 'delete'; message: string }) => {
    const campaign = await campaignRepository.findById(payload.campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }

    const ownerId = campaign.organizer.toString();
    const createdById = (campaign as { createdBy?: { toString: () => string } }).createdBy?.toString?.();
    if (ownerId !== payload.userId && createdById !== payload.userId) {
      throw { status: 403, message: 'You are not allowed to modify this campaign' };
    }

    const existing = await campaignActionRequestRepository.findPendingByCampaignAndAction(payload.campaignId, payload.action);
    if (existing) {
      throw { status: 409, message: 'A pending request already exists for this campaign' };
    }

    const request = await campaignActionRequestRepository.create({
      campaign: payload.campaignId,
      requestedBy: payload.userId,
      action: payload.action,
      message: payload.message
    });

    return { requestId: request._id.toString(), status: request.status };
  }
};
