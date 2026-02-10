import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const publicLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_PUBLIC_WINDOW_MS,
  max: env.RATE_LIMIT_PUBLIC_MAX,
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_AUTH_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false
});

export const adminLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_ADMIN_WINDOW_MS,
  max: env.RATE_LIMIT_ADMIN_MAX,
  standardHeaders: true,
  legacyHeaders: false
});
