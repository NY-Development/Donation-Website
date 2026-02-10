import { NextFunction, Request, Response } from 'express';
import { donationService } from './donation.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const donationController = {
  checkout: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await donationService.createCheckout({
        campaignId: req.body.campaignId,
        amount: req.body.amount,
        userId: req.user?.id
      });
      res.status(201).json({ success: true, message: 'Checkout created', data });
    } catch (error) {
      next(error);
    }
  },
  webhook: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await donationService.handleWebhook(req.headers['stripe-signature'], req.body as Buffer);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
};
