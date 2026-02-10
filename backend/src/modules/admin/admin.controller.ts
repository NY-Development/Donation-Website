import { NextFunction, Request, Response } from 'express';
import { adminService } from './admin.service';

export const adminController = {
  overview: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.getOverview();
      res.json({ success: true, message: 'Admin overview fetched', data });
    } catch (error) {
      next(error);
    }
  },
  verifyCampaign: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.verifyCampaign(req.params.id, req.body.status);
      res.json({ success: true, message: 'Campaign updated', data });
    } catch (error) {
      next(error);
    }
  }
};
