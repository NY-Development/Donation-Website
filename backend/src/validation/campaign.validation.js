const { z } = require('zod');

const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    goalAmount: z.number().positive('Goal amount must be greater than 0'),
    startDate: z.string().datetime('Invalid start date'),
    endDate: z.string().datetime('Invalid end date'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    featured: z.boolean().optional().default(false),
  }),
});

const updateCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    goalAmount: z.number().positive('Goal amount must be greater than 0').optional(),
    startDate: z.string().datetime('Invalid start date').optional(),
    endDate: z.string().datetime('Invalid end date').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    featured: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid campaign ID'),
  }),
});

module.exports = { createCampaignSchema, updateCampaignSchema };
