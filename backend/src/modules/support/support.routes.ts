import { Router } from 'express';
import { supportController } from './support.controller';
import { createSupportSchema, supportAdminQuerySchema, supportIdSchema } from './support.schema';
import { validate } from '../../utils/validate';
import { optionalAuth, requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { adminLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.post('/', optionalAuth, validate(createSupportSchema, 'body'), supportController.create);
router.get('/', requireAuth, requireRole(['admin']), adminLimiter, validate(supportAdminQuerySchema, 'query'), supportController.listForAdmin);
router.get('/:id', requireAuth, requireRole(['admin']), adminLimiter, validate(supportIdSchema, 'params'), supportController.getByIdForAdmin);

export default router;
