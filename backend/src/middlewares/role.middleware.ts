import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireRole = (roles: Array<'donor' | 'organizer' | 'admin'>) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const t = req.t ?? ((key: string) => key);
      return res.status(403).json({ success: false, message: t('errors.forbidden') });
    }
    return next();
  };
