import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { supportService } from './support.service';

export const supportController = {
  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await supportService.createRequest({
        userId: req.user?.id,
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
      });

      const t = req.t ?? ((key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? key);
      res.status(201).json({
        success: true,
        message: t('messages.supportCreated', { defaultValue: 'Support request submitted successfully.' }),
        data
      });
    } catch (error) {
      next(error);
    }
  },

  listForAdmin: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await supportService.listForAdmin({
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string | undefined,
        status: req.query.status as 'open' | 'resolved' | undefined
      });

      const t = req.t ?? ((key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? key);
      res.json({
        success: true,
        message: t('messages.supportListFetched', { defaultValue: 'Support requests fetched successfully.' }),
        data
      });
    } catch (error) {
      next(error);
    }
  },

  getByIdForAdmin: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await supportService.getByIdForAdmin(req.params.id);
      const t = req.t ?? ((key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? key);
      res.json({
        success: true,
        message: t('messages.supportItemFetched', { defaultValue: 'Support request fetched successfully.' }),
        data
      });
    } catch (error) {
      next(error);
    }
  },

  replyForAdmin: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await supportService.replyForAdmin({
        id: req.params.id,
        subject: req.body.subject,
        content: req.body.content,
        adminId: req.user?.id
      });

      const t = req.t ?? ((key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? key);
      res.json({
        success: true,
        message: t('messages.supportReplySent', { defaultValue: 'Reply email sent successfully.' }),
        data
      });
    } catch (error) {
      next(error);
    }
  }
};
