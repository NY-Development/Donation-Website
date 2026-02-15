import { NextFunction, Request, Response } from 'express';
import { donationService } from './donation.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const donationController = {
  checkout: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const data = await donationService.createCheckout({
        campaignId: req.body.campaignId,
        amount: req.body.amount,
        userId: req.user?.id
      });
      res.status(201).json({ success: true, message: t('messages.checkoutCreated'), data });
    } catch (error) {
      next(error);
    }
  },
  verifyCbe: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const amount = Number(req.body.amount);
      const data = await donationService.verifyCbeDonation({
        campaignId: req.body.campaignId,
        amount,
        transactionId: req.body.transactionId,
        screenshotBuffer: req.file?.buffer,
        userId: req.user?.id,
        donorName: req.body.donorName,
        donorEmail: req.body.donorEmail
      });
      res.status(201).json({ success: true, message: t('messages.donationVerified'), data });
    } catch (error) {
      next(error);
    }
  },
  submit: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const t = req.t ?? ((key: string) => key);
      const amount = Number(req.body.amount);
      const data = await donationService.submitDonation({
        campaignId: req.body.campaignId,
        amount,
        userId: req.user?.id,
        donorName: req.body.donorName,
        donorEmail: req.body.donorEmail,
        receiptBuffer: req.file?.buffer
      });
      res.status(201).json({ success: true, message: t('messages.donationSubmitted'), data });
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
