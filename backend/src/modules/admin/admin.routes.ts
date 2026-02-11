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

router.get('/overview', requireAuth, requireRole(['admin']), adminLimiter, adminController.overview);
router.patch('/campaigns/:id/verify', requireAuth, requireRole(['admin']), adminLimiter, validate(idSchema, 'params'), validate(verifySchema, 'body'), adminController.verifyCampaign);
router.get('/organizer-verifications', requireAuth, requireRole(['admin']), adminLimiter, adminController.getOrganizerVerifications);
router.post('/organizer-verifications/:userId/approve', requireAuth, requireRole(['admin']), adminLimiter, validate(userIdSchema, 'params'), adminController.approveOrganizer);
router.post('/organizer-verifications/:userId/reject', requireAuth, requireRole(['admin']), adminLimiter, validate(userIdSchema, 'params'), validate(rejectionSchema, 'body'), adminController.rejectOrganizer);

export default router;
