import { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import { env } from '../../config/env';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { userService } from '../users/user.service';

export const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      const result = await authService.signup(req.body);
      res.json({
        success: true,
        message: t('messages.signupSuccess'),
        data: {
          user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            emailVerified: result.user.emailVerified
          },
          requiresOtp: result.requiresOtp
        }
      });
    } catch (error) {
      next(error);
    }
  },
  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      const user = await authService.verifyOtp(req.body);
      res.json({
        success: true,
        message: t('messages.emailVerified'),
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified }
        }
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      const result = await authService.login(req.body);
      res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: env.COOKIE_SECURE });
      res.json({
        success: true,
        message: t('messages.loginSuccess'),
        data: {
          user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            emailVerified: result.user.emailVerified
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      await authService.forgotPassword(req.body.email);
      res.json({ success: true, message: t('messages.passwordResetStarted') });
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      await authService.resetPassword(req.body.email, req.body.password);
      res.json({ success: true, message: t('messages.passwordResetSuccessful') });
    } catch (error) {
      next(error);
    }
  },
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const t = (req as Request & { t?: (key: string) => string }).t ?? ((key: string) => key);
      const result = await authService.refresh(req.body.refreshToken);
      res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: env.COOKIE_SECURE });
      res.json({ success: true, message: t('messages.tokenRefreshed'), data: result });
    } catch (error) {
      next(error);
    }
  },
  me: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const user = await userService.getProfile(req.user?.id ?? '');
      res.json({ success: true, message: t('messages.authenticated'), data: user });
    } catch (error) {
      next(error);
    }
  }
};
