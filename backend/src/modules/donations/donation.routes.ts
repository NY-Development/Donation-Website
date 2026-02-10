import { Router } from 'express';
import { donationController } from './donation.controller';
import { optionalAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../utils/validate';
import { z } from 'zod';

const router = Router();

const checkoutSchema = z.object({
  campaignId: z.string().min(1),
  amount: z.number().positive()
});

router.post('/checkout', optionalAuth, validate(checkoutSchema, 'body'), donationController.checkout);
router.post('/webhook', donationController.webhook);

export default router;
