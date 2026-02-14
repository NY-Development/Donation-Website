import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { userController } from './user.controller';
import { validate } from '../../utils/validate';
import { z } from 'zod';

const router = Router();
const dashboardQuerySchema = z.object({
	limit: z.coerce.number().min(1).max(50).optional(),
	cursor: z.string().optional()
});

const trendsQuerySchema = z.object({
  days: z.coerce.number().min(3).max(30).optional()
});

const organizerCampaignsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(24).optional()
});

const pendingDonationsQuerySchema = z.object({
	limit: z.coerce.number().min(1).max(50).optional()
});

const updateProfileSchema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email().optional()
});

router.get('/me', requireAuth, userController.getMe);
router.patch('/me', requireAuth, validate(updateProfileSchema, 'body'), userController.updateMe);

router.get('/me/dashboard', requireAuth, validate(dashboardQuerySchema, 'query'), userController.getDashboard);
router.get('/me/trends', requireAuth, validate(trendsQuerySchema, 'query'), userController.getTrends);
router.get('/me/campaigns', requireAuth, validate(organizerCampaignsQuerySchema, 'query'), userController.getMyCampaigns);
router.get('/me/pending-donations', requireAuth, validate(pendingDonationsQuerySchema, 'query'), userController.getPendingDonations);

export default router;
