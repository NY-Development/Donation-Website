import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { userService } from './user.service';

export const userController = {
  getMe: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.user?.id ?? '');
      res.json({ success: true, message: 'Profile fetched', data: user });
    } catch (error) {
      next(error);
    }
  },
  getDashboard: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit ?? 20);
      const cursor = req.query.cursor as string | undefined;
      const dashboard = await userService.getDashboard(req.user?.id ?? '', limit, cursor);
      res.json({ success: true, message: 'Dashboard fetched', data: dashboard });
    } catch (error) {
      next(error);
    }
  },
  getTrends: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const days = req.query.days ? Number(req.query.days) : 7;
      const trends = await userService.getTrends(req.user?.id ?? '', days);
      res.json({ success: true, message: 'Trends fetched', data: trends });
    } catch (error) {
      next(error);
    }
  },
  getMyCampaigns: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 12;
      const campaigns = await userService.getMyCampaigns(req.user?.id ?? '', limit);
      res.json({ success: true, message: 'Organizer campaigns fetched', data: campaigns });
    } catch (error) {
      next(error);
    }
  },
  getPendingDonations: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await userService.getPendingDonations(req.user?.id ?? '', limit);
      res.json({ success: true, message: 'Pending donations fetched', data });
    } catch (error) {
      next(error);
    }
  }
};
