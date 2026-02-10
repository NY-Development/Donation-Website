import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
  COOKIE_SECURE: z.string().default('false'),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  PAYMENT_PROVIDER: z.enum(['stripe', 'chapa']).default('stripe'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  CHAPA_SECRET_KEY: z.string().optional(),
  RATE_LIMIT_PUBLIC_WINDOW_MS: z.string().default('60000'),
  RATE_LIMIT_PUBLIC_MAX: z.string().default('120'),
  RATE_LIMIT_AUTH_WINDOW_MS: z.string().default('60000'),
  RATE_LIMIT_AUTH_MAX: z.string().default('30'),
  RATE_LIMIT_ADMIN_WINDOW_MS: z.string().default('60000'),
  RATE_LIMIT_ADMIN_MAX: z.string().default('60'),
  REDIS_URL: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = {
  ...parsed.data,
  COOKIE_SECURE: parsed.data.COOKIE_SECURE === 'true',
  RATE_LIMIT_PUBLIC_WINDOW_MS: Number(parsed.data.RATE_LIMIT_PUBLIC_WINDOW_MS),
  RATE_LIMIT_PUBLIC_MAX: Number(parsed.data.RATE_LIMIT_PUBLIC_MAX),
  RATE_LIMIT_AUTH_WINDOW_MS: Number(parsed.data.RATE_LIMIT_AUTH_WINDOW_MS),
  RATE_LIMIT_AUTH_MAX: Number(parsed.data.RATE_LIMIT_AUTH_MAX),
  RATE_LIMIT_ADMIN_WINDOW_MS: Number(parsed.data.RATE_LIMIT_ADMIN_WINDOW_MS),
  RATE_LIMIT_ADMIN_MAX: Number(parsed.data.RATE_LIMIT_ADMIN_MAX)
};
