import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export type AuthRequest = Request & {
  user?: { id: string; role: 'donor' | 'organizer' | 'admin' };
};

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : (req.cookies?.accessToken ?? null);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : (req.cookies?.accessToken ?? null);

  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId, role: payload.role };
  } catch {
    req.user = undefined;
  }

  return next();
};
