import { NextFunction, Response } from 'express';
import { adminService } from './admin.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const adminController = {
  overview: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getOverview();
      const t = (res.req as AuthRequest).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.adminOverviewFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  getTrends: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const days = req.query.days ? Number(req.query.days) : 7;
      const data = await adminService.getTrends(days);
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.trendsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  getTopCampaigns: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const data = await adminService.getTopCampaigns(limit);
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.topCampaignsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  verifyCampaign: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.verifyCampaign(req.params.id, req.body.status);
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.campaignUpdated'), data });
    } catch (error) {
      next(error);
    }
  },
  getOrganizerVerifications: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getOrganizerVerifications();
      const t = (res.req as AuthRequest).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.organizerVerificationsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  getUsers: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getUsers({
        search: req.query.search as string | undefined,
        role: req.query.role as string | undefined,
        verification: req.query.verification as 'pending' | 'approved' | 'rejected' | undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined
      });
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.usersFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  getSettings: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getSettings();
      const t = (res.req as AuthRequest).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.settingsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  getPublicSettings: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getPublicSettings();
      const t = (res.req as AuthRequest).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.publicSettingsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  updateSettings: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.updateSettings(req.body ?? {});
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.settingsUpdated'), data });
    } catch (error) {
      next(error);
    }
  },
  approveOrganizer: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.approveOrganizer(req.params.userId, req.user?.id ?? '');
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.organizerApproved'), data });
    } catch (error) {
      next(error);
    }
  },
  rejectOrganizer: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.rejectOrganizer(req.params.userId, req.user?.id ?? '', req.body.reason);
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.organizerRejected'), data });
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.deleteUser(req.params.id);
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.userDeleted'), data });
    } catch (error) {
      next(error);
    }
  },
  deleteAllUsers: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.deleteAllUsers();
      const t = (res.req as AuthRequest).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.usersDeleted'), data });
    } catch (error) {
      next(error);
    }
  },
  deleteCampaign: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.deleteCampaign(req.params.id);
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.campaignDeleted'), data });
    } catch (error) {
      next(error);
    }
  },
  deleteAllCampaigns: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.deleteAllCampaigns();
      const t = (res.req as AuthRequest).t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.campaignsDeleted'), data });
    } catch (error) {
      next(error);
    }
  },
  getCampaignActionRequests: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await adminService.getCampaignActionRequests(limit);
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.campaignActionRequestsFetched'), data });
    } catch (error) {
      next(error);
    }
  },
  approveCampaignActionRequest: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.approveCampaignActionRequest(req.params.id, req.user?.id ?? '');
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.requestApproved'), data });
    } catch (error) {
      next(error);
    }
  },
  rejectCampaignActionRequest: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.rejectCampaignActionRequest(req.params.id, req.user?.id ?? '', req.body.reason);
      const t = req.t ?? ((key: string) => key);
      res.json({ success: true, message: t('messages.requestRejected'), data });
    } catch (error) {
      next(error);
    }
  }
};
