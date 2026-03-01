import { z } from 'zod';

export const createSupportSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(3).max(180),
  message: z.string().min(10).max(5000)
});

export const supportAdminQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().trim().min(1).optional(),
  status: z.enum(['open', 'resolved']).optional()
});

export const supportIdSchema = z.object({
  id: z.string().min(1)
});

export const supportReplySchema = z.object({
  subject: z.string().min(3).max(180),
  content: z.string().min(10).max(5000)
});
