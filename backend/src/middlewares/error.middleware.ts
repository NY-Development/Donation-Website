import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export type ApiError = {
  status?: number;
  message: string;
};

export const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  const requestId = req.headers['x-request-id'];
  logger.error('Request failed', { status, message: err.message, requestId });
  res.status(status).json({ success: false, message: err.message, requestId });
};
