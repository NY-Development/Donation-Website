import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { userRepository } from '../modules/users/user.repository';

export type AuthRequest = Request & {
  user?: { id: string; role: 'donor' | 'organizer' | 'admin'; isOrganizerVerified: boolean };
  t?: (key: string, options?: { defaultValue?: string }) => string;
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const t = req.t ?? ((key: string) => key);
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : (req.cookies?.accessToken ?? null);

  if (!token) {
    return res.status(401).json({ success: false, message: t('errors.unauthorized') });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await userRepository.findByIdLean(payload.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: t('errors.unauthorized') });
    }
    req.user = { id: user._id.toString(), role: user.role, isOrganizerVerified: Boolean(user.isOrganizerVerified) };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: t('errors.invalidToken') });
  }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : (req.cookies?.accessToken ?? null);

  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await userRepository.findByIdLean(payload.userId);
    if (user) {
      req.user = { id: user._id.toString(), role: user.role, isOrganizerVerified: Boolean(user.isOrganizerVerified) };
    }
  } catch {
    req.user = undefined;
  }

  return next();
};
