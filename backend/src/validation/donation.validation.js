const { z } = require('zod');

const createDonationSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
    campaignId: z.string().uuid('Invalid campaign ID'),
    message: z.string().max(500, 'Message must be less than 500 characters').optional(),
    anonymous: z.boolean().optional().default(false),
  }),
});

const getDonationsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    campaignId: z.string().uuid().optional(),
  }),
});

module.exports = { createDonationSchema, getDonationsQuerySchema };
