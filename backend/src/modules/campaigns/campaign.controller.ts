import { NextFunction, Request, Response } from 'express';
import { campaignService } from './campaign.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const campaignController = {
  getFeatured: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.getFeatured();
      res.json({ success: true, message: 'Featured campaigns fetched', data });
    } catch (error) {
      next(error);
    }
  },
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.list(req.query as never);
      res.json({ success: true, message: 'Campaigns fetched', data });
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.getById(req.params.id);
      res.json({ success: true, message: 'Campaign fetched', data: campaign });
    } catch (error) {
      next(error);
    }
  },
  getDonors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.getDonors(req.params.id);
      res.json({ success: true, message: 'Donors fetched', data });
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
      res.status(201).json({ success: true, message: 'Campaign draft created', data: campaign });
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.updateCampaign(req.params.id, req.body);
      res.json({ success: true, message: 'Campaign updated', data: campaign });
    } catch (error) {
      next(error);
    }
  },
  uploadMedia: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.uploadMedia(req.params.id, req.body.media);
      res.json({ success: true, message: 'Media uploaded', data: campaign });
    } catch (error) {
      next(error);
    }
  },
  submit: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await campaignService.submitCampaign(req.params.id);
      res.json({ success: true, message: 'Campaign submitted', data: campaign });
    } catch (error) {
      next(error);
    }
  },
  getGlobalStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await campaignService.getGlobalStats();
      res.json({ success: true, message: 'Global stats fetched', data });
    } catch (error) {
      next(error);
    }
  },
  getSuccessStories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const data = await campaignService.getSuccessStories(limit);
      res.json({ success: true, message: 'Success stories fetched', data });
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
      res.status(201).json({ success: true, message: 'Request submitted', data });
    } catch (error) {
      next(error);
    }
  }
};
