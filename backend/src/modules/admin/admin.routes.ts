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

router.get('/overview', requireAuth, requireRole(['admin']), adminLimiter, adminController.overview);
router.patch('/campaigns/:id/verify', requireAuth, requireRole(['admin']), adminLimiter, validate(idSchema, 'params'), validate(verifySchema, 'body'), adminController.verifyCampaign);

export default router;
