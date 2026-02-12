import { Router } from 'express';
import { adminController } from './admin.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { adminLimiter } from '../../middlewares/rateLimiter';
import { validate } from '../../utils/validate';
import { z } from 'zod';

const router = Router();

const verifySchema = z.object({
  status: z.enum(['approved', 'rejected'])
});

const idSchema = z.object({
  id: z.string().min(1)
});

const userIdSchema = z.object({
  userId: z.string().min(1)
});

const rejectionSchema = z.object({
  reason: z.string().min(3).optional()
});

const settingsSchema = z.object({
  platformName: z.string().min(2).optional(),
  supportEmail: z.string().email().optional(),
  maintenanceMode: z.boolean().optional(),
  platformFeePercent: z.number().min(0).max(100).optional(),
  settlementCurrency: z.string().min(2).optional(),
  enforce2fa: z.boolean().optional(),
  sessionTimeoutMinutes: z.number().min(5).max(720).optional(),
  auditLogging: z.boolean().optional(),
  notifications: z
    .object({
      largeDonation: z.boolean().optional(),
      newCampaignVerification: z.boolean().optional()
    })
    .optional()
});

const trendsQuerySchema = z.object({
  days: z.coerce.number().min(3).max(30).optional()
});

const topCampaignsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(10).optional()
});

router.get('/overview', requireAuth, requireRole(['admin']), adminLimiter, adminController.overview);
router.get('/trends', requireAuth, requireRole(['admin']), adminLimiter, validate(trendsQuerySchema, 'query'), adminController.getTrends);
router.get('/top-campaigns', requireAuth, requireRole(['admin']), adminLimiter, validate(topCampaignsQuerySchema, 'query'), adminController.getTopCampaigns);
router.get('/users', requireAuth, requireRole(['admin']), adminLimiter, adminController.getUsers);
router.patch('/campaigns/:id/verify', requireAuth, requireRole(['admin']), adminLimiter, validate(idSchema, 'params'), validate(verifySchema, 'body'), adminController.verifyCampaign);
router.get('/organizer-verifications', requireAuth, requireRole(['admin']), adminLimiter, adminController.getOrganizerVerifications);
router.post('/organizer-verifications/:userId/approve', requireAuth, requireRole(['admin']), adminLimiter, validate(userIdSchema, 'params'), adminController.approveOrganizer);
router.post('/organizer-verifications/:userId/reject', requireAuth, requireRole(['admin']), adminLimiter, validate(userIdSchema, 'params'), validate(rejectionSchema, 'body'), adminController.rejectOrganizer);
router.get('/settings', requireAuth, requireRole(['admin']), adminLimiter, adminController.getSettings);
router.put('/settings', requireAuth, requireRole(['admin']), adminLimiter, validate(settingsSchema, 'body'), adminController.updateSettings);

export default router;
