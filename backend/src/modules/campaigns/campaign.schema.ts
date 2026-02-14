import { z } from 'zod';

export const createCampaignSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  story: z.string().min(10),
  goalAmount: z.number().positive(),
  cbeAccountNumber: z.string().min(6),
  location: z.string().min(2).optional(),
  urgent: z.boolean().optional(),
  fundingStyle: z.enum(['keep', 'all_or_nothing']).optional()
});

export const updateCampaignSchema = z.object({
  title: z.string().min(3).optional(),
  category: z.string().min(2).optional(),
  story: z.string().min(10).optional(),
  goalAmount: z.number().positive().optional(),
  cbeAccountNumber: z.string().min(6).optional(),
  location: z.string().min(2).optional(),
  urgent: z.boolean().optional(),
  fundingStyle: z.enum(['keep', 'all_or_nothing']).optional()
});

export const campaignActionRequestSchema = z.object({
  action: z.enum(['pause', 'delete']),
  message: z.string().min(5).max(500)
});

export const mediaSchema = z.object({
  media: z.array(z.string().min(10)).min(1)
});

export const campaignIdSchema = z.object({
  id: z.string().min(1)
});

export const campaignQuerySchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  urgent: z.string().optional(),
  status: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(12),
  page: z.coerce.number().min(1).optional(),
  cursor: z.string().optional(),
  sort: z.enum(['asc', 'desc']).default('desc')
});
