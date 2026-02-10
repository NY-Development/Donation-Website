import { cloudinary } from '../../config/cloudinary';
import { Types } from 'mongoose';
import { cache } from '../../utils/cache';
import { buildCursorFilter, makeCursor } from '../../utils/pagination';
import { campaignRepository } from './campaign.repository';
import { donationRepository } from '../donations/donation.repository';

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
    const filters: Record<string, unknown> = { status: query.status ?? 'approved' };
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
      return cached;
    }

    const usePage = Boolean(query.page) && !query.cursor;
    const cursorFilter = buildCursorFilter(query.cursor, query.sort);
    const page = query.page ?? 1;
    const skip = usePage ? (page - 1) * query.limit : 0;
    const data = await campaignRepository.find({ ...filters, ...cursorFilter }, query.limit, query.sort, skip);

    const nextCursor = data.length ? makeCursor(data[data.length - 1].createdAt, data[data.length - 1]._id.toString()) : null;
    const response = { data, nextCursor };
    await cache.set(cacheKey, response, 60);
    return response;
  },
  getById: async (campaignId: string) => {
    const campaign = await campaignRepository.findByIdLean(campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
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
    organizerId: string;
    location?: string;
    urgent?: boolean;
  }) => {
    const campaign = await campaignRepository.create({
      title: payload.title,
      category: payload.category,
      story: payload.story,
      goalAmount: payload.goalAmount,
      location: payload.location,
      urgent: payload.urgent,
      organizer: new Types.ObjectId(payload.organizerId),
      status: 'draft'
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
  }
};
