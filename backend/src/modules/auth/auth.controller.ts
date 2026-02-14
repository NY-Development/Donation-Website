import { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import { env } from '../../config/env';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { userService } from '../users/user.service';

export const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.signup(req.body);
      res.json({
        success: true,
        message: 'Signup successful. Verification code sent.',
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
      const user = await authService.verifyOtp(req.body);
      res.json({
        success: true,
        message: 'Email verified successfully',
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
      const result = await authService.login(req.body);
      res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: env.COOKIE_SECURE });
      res.json({
        success: true,
        message: 'Login successful',
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
      await authService.forgotPassword(req.body.email);
      res.json({ success: true, message: 'Password reset started' });
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.resetPassword(req.body.email, req.body.password);
      res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  },
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.refresh(req.body.refreshToken);
      res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: env.COOKIE_SECURE });
      res.json({ success: true, message: 'Token refreshed', data: result });
    } catch (error) {
      next(error);
    }
  },
  me: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.user?.id ?? '');
      res.json({ success: true, message: 'Authenticated', data: user });
    } catch (error) {
      next(error);
    }
  }
};
