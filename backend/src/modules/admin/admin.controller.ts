import { NextFunction, Response } from 'express';
import { adminService } from './admin.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const adminController = {
  overview: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getOverview();
      res.json({ success: true, message: 'Admin overview fetched', data });
    } catch (error) {
      next(error);
    }
  },
  getTrends: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const days = req.query.days ? Number(req.query.days) : 7;
      const data = await adminService.getTrends(days);
      res.json({ success: true, message: 'Trends fetched', data });
    } catch (error) {
      next(error);
    }
  },
  getTopCampaigns: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const data = await adminService.getTopCampaigns(limit);
      res.json({ success: true, message: 'Top campaigns fetched', data });
    } catch (error) {
      next(error);
    }
  },
  verifyCampaign: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.verifyCampaign(req.params.id, req.body.status);
      res.json({ success: true, message: 'Campaign updated', data });
    } catch (error) {
      next(error);
    }
  },
  getOrganizerVerifications: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getOrganizerVerifications();
      res.json({ success: true, message: 'Organizer verifications fetched', data });
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
      res.json({ success: true, message: 'Users fetched', data });
    } catch (error) {
      next(error);
    }
  },
  getSettings: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getSettings();
      res.json({ success: true, message: 'Settings fetched', data });
    } catch (error) {
      next(error);
    }
  },
  getPublicSettings: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getPublicSettings();
      res.json({ success: true, message: 'Public settings fetched', data });
    } catch (error) {
      next(error);
    }
  },
  updateSettings: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.updateSettings(req.body ?? {});
      res.json({ success: true, message: 'Settings updated', data });
    } catch (error) {
      next(error);
    }
  },
  approveOrganizer: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.approveOrganizer(req.params.userId, req.user?.id ?? '');
      res.json({ success: true, message: 'Organizer approved', data });
    } catch (error) {
      next(error);
    }
  },
  rejectOrganizer: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.rejectOrganizer(req.params.userId, req.user?.id ?? '', req.body.reason);
      res.json({ success: true, message: 'Organizer rejected', data });
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.deleteUser(req.params.id);
      res.json({ success: true, message: 'User deleted', data });
    } catch (error) {
      next(error);
    }
  },
  deleteAllUsers: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.deleteAllUsers();
      res.json({ success: true, message: 'Users deleted', data });
    } catch (error) {
      next(error);
    }
  },
  deleteCampaign: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.deleteCampaign(req.params.id);
      res.json({ success: true, message: 'Campaign deleted', data });
    } catch (error) {
      next(error);
    }
  },
  deleteAllCampaigns: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.deleteAllCampaigns();
      res.json({ success: true, message: 'Campaigns deleted', data });
    } catch (error) {
      next(error);
    }
  },
  getCampaignActionRequests: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await adminService.getCampaignActionRequests(limit);
      res.json({ success: true, message: 'Campaign action requests fetched', data });
    } catch (error) {
      next(error);
    }
  },
  approveCampaignActionRequest: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.approveCampaignActionRequest(req.params.id, req.user?.id ?? '');
      res.json({ success: true, message: 'Request approved', data });
    } catch (error) {
      next(error);
    }
  },
  rejectCampaignActionRequest: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.rejectCampaignActionRequest(req.params.id, req.user?.id ?? '', req.body.reason);
      res.json({ success: true, message: 'Request rejected', data });
    } catch (error) {
      next(error);
    }
  }
};
