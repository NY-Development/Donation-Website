import { Router } from 'express';
import { supportController } from './support.controller';
import {
	createSupportSchema,
	supportAdminQuerySchema,
	supportIdSchema,
	supportPublicUserIdSchema,
	supportReplySchema
} from './support.schema';
import { validate } from '../../utils/validate';
import { optionalAuth, requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { adminLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.post('/', optionalAuth, validate(createSupportSchema, 'body'), supportController.create);
router.get('/public/:userId', validate(supportPublicUserIdSchema, 'params'), supportController.getByIdForPublic);
router.get('/', requireAuth, requireRole(['admin']), adminLimiter, validate(supportAdminQuerySchema, 'query'), supportController.listForAdmin);
router.get('/:id', requireAuth, requireRole(['admin']), adminLimiter, validate(supportIdSchema, 'params'), supportController.getByIdForAdmin);
router.post('/:id/reply', requireAuth, requireRole(['admin']), adminLimiter, validate(supportIdSchema, 'params'), validate(supportReplySchema, 'body'), supportController.replyForAdmin);

export default router;
