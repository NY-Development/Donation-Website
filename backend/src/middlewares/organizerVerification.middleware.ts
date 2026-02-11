import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireOrganizerVerification = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  if (!req.user?.isOrganizerVerified) {
    return res.status(403).json({
      success: false,
      message: 'Organizer verification required before creating campaigns'
    });
  }

  return next();
};
