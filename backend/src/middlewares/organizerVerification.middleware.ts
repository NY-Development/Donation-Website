import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireOrganizerVerification = (req: AuthRequest, res: Response, next: NextFunction) => {
  const t = req.t ?? ((key: string) => key);
  if (req.user?.role === 'admin') {
    return next();
  }
  if (!req.user?.isOrganizerVerified) {
    return res.status(403).json({
      success: false,
      message: t('errors.organizerVerificationRequired')
    });
  }

  return next();
};
