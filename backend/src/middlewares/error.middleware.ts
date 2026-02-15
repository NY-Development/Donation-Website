import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export type ApiError = {
  status?: number;
  message: string;
};

export const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  const requestId = req.headers['x-request-id'];
  const t = (req as Request & { t?: (key: string, options?: { defaultValue?: string }) => string }).t;
  const message = t ? t(err.message, { defaultValue: err.message }) : err.message;
  logger.error('Request failed', { status, message, requestId });
  res.status(status).json({ success: false, message, requestId });
};
