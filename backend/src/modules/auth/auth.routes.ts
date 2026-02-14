import { Router } from 'express';
import { validate } from '../../utils/validate';
import { authLimiter } from '../../middlewares/rateLimiter';
import { authController } from './auth.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { forgotPasswordSchema, loginSchema, refreshSchema, resetPasswordSchema, signupSchema, verifyOtpSchema } from './auth.schema';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema, 'body'), authController.signup);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema, 'body'), authController.verifyOtp);
router.post('/login', authLimiter, validate(loginSchema, 'body'), authController.login);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema, 'body'), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema, 'body'), authController.resetPassword);
router.post('/refresh', authLimiter, validate(refreshSchema, 'body'), authController.refresh);
router.get('/me', requireAuth, authController.me);

export default router;
