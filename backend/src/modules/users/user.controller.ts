import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { userService } from './user.service';

export const userController = {
  getMe: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const user = await userService.getProfile(req.user?.id ?? '');
      res.json({ success: true, message: t('messages.profileFetched'), data: user });
    } catch (error) {
      next(error);
    }
  },
  updateMe: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const user = await userService.updateProfile(req.user?.id ?? '', {
        name: req.body?.name,
        email: req.body?.email,
        profileImageFile: req.file
      });
      res.json({ success: true, message: t('messages.profileUpdated'), data: user });
    } catch (error) {
      next(error);
    }
  },
  getDashboard: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const limit = Number(req.query.limit ?? 20);
      const cursor = req.query.cursor as string | undefined;
      const dashboard = await userService.getDashboard(req.user?.id ?? '', limit, cursor);
      res.json({ success: true, message: t('messages.dashboardFetched'), data: dashboard });
    } catch (error) {
      next(error);
    }
  },
  getTrends: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const days = req.query.days ? Number(req.query.days) : 7;
      const trends = await userService.getTrends(req.user?.id ?? '', days);
      res.json({ success: true, message: t('messages.trendsFetched'), data: trends });
    } catch (error) {
      next(error);
    }
  },
  getMyCampaigns: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const limit = req.query.limit ? Number(req.query.limit) : 12;
      const campaigns = await userService.getMyCampaigns(req.user?.id ?? '', limit);
      res.json({ success: true, message: t('messages.organizerCampaignsFetched'), data: campaigns });
    } catch (error) {
      next(error);
    }
  },
  getPendingDonations: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await userService.getPendingDonations(req.user?.id ?? '', limit);
      res.json({ success: true, message: t('messages.pendingDonationsFetched'), data });
    } catch (error) {
      next(error);
    }
  }
};
