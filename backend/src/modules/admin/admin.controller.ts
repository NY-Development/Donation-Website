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
