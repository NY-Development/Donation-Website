import { Router } from 'express';
import { validate } from '../../utils/validate';
import { authLimiter } from '../../middlewares/rateLimiter';
import { authController } from './auth.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { loginSchema, refreshSchema, signupSchema } from './auth.schema';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema, 'body'), authController.signup);
router.post('/login', authLimiter, validate(loginSchema, 'body'), authController.login);
router.post('/refresh', authLimiter, validate(refreshSchema, 'body'), authController.refresh);
router.get('/me', requireAuth, authController.me);

export default router;
