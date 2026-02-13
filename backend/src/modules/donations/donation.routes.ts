import { Router } from 'express';
import multer from 'multer';
import { donationController } from './donation.controller';
import { optionalAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../utils/validate';
import { z } from 'zod';

const router = Router();

const checkoutSchema = z.object({
  campaignId: z.string().min(1),
  amount: z.number().positive()
});

const cbeVerifySchema = z.object({
  campaignId: z.string().min(1),
  amount: z.coerce.number().positive(),
  transactionId: z.string().min(3).optional(),
  donorName: z.string().min(2).optional()
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/checkout', optionalAuth, validate(checkoutSchema, 'body'), donationController.checkout);
router.post('/cbe/verify', optionalAuth, upload.single('screenshot'), validate(cbeVerifySchema, 'body'), donationController.verifyCbe);
router.post('/webhook', donationController.webhook);

export default router;
