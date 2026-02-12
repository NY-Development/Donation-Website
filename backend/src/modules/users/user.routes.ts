import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { userController } from './user.controller';
import { validate } from '../../utils/validate';
import { z } from 'zod';

const router = Router();

router.get('/me', requireAuth, userController.getMe);
const dashboardQuerySchema = z.object({
	limit: z.coerce.number().min(1).max(50).optional(),
	cursor: z.string().optional()
});

const trendsQuerySchema = z.object({
  days: z.coerce.number().min(3).max(30).optional()
});

router.get('/me/dashboard', requireAuth, validate(dashboardQuerySchema, 'query'), userController.getDashboard);
router.get('/me/trends', requireAuth, validate(trendsQuerySchema, 'query'), userController.getTrends);

export default router;
