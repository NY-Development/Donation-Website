import { NextFunction, Request, Response } from 'express';
import { campaignService } from './campaign.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const campaignController = {
  getFeatured: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.getFeatured();
      const t = (res.req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.featuredCampaignsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.list(req.query as never);
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.campaignsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.getById(req.params.id);
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.campaignFetched'), data: campaign });
    } catch (error) {
      next(error);
    }
  },
  getDonors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.getDonors(req.params.id);
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.donorsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.createDraft({
        ...req.body,
        organizerId: req.user?.id ?? ''
      });
      const t = req.t ?? ((key: string) => key);
      res.status(201).json({ success: true, message: t('messages.campaignDraftCreated'), data: campaign });
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.updateCampaign(req.params.id, req.body);
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.campaignUpdated'), data: campaign });
    } catch (error) {
      next(error);
    }
  },
  uploadMedia: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.uploadMedia(req.params.id, req.body.media);
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.mediaUploaded'), data: campaign });
    } catch (error) {
      next(error);
    }
  },
  submit: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.submitCampaign(req.params.id);
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.campaignSubmitted'), data: campaign });
    } catch (error) {
      next(error);
    }
  },
  getGlobalStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.getGlobalStats();
      const t = (res.req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.globalStatsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  getSuccessStories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const data = await campaignService.getSuccessStories(limit);
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.successStoriesFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  requestAction: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.createActionRequest({
        campaignId: req.params.id,
        userId: req.user?.id ?? '',
        action: req.body.action,
        message: req.body.message
      });
      const t = req.t ?? ((key: string) => key);
      res.status(201).json({ success: true, message: t('messages.requestSubmitted'), data });
    } catch (error) {
      next(error);
    }
  }
};
