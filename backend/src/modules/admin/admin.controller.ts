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
  }
};
