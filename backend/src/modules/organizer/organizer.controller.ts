import { NextFunction, Response } from 'express';
import type { AuthRequest } from '../../middlewares/auth.middleware';
import { organizerService } from './organizer.service';

export const organizerController = {
  status: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const user = await organizerService.getStatus(req.user?.id ?? '');
      res.json({ success: true, message: t('messages.organizerStatusFetched'), data: user });
    } catch (error) {
      next(error);
    }
  },
  verify: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const files = req.files as { [field: string]: Express.Multer.File[] } | undefined;
      const payload = {
        idFront: files?.idFront?.[0],
        idBack: files?.idBack?.[0],
        livePhoto: files?.livePhoto?.[0]
      };
      const data = await organizerService.submitVerification(req.user?.id ?? '', payload, {
        documentType: req.body?.documentType
      });
      res.status(201).json({ success: true, message: t('messages.verificationSubmitted'), data });
    } catch (error) {
      next(error);
    }
  }
};
