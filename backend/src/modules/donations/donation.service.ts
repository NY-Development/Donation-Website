import { stripe, paymentProvider } from '../../config/payment';
import { Types } from 'mongoose';
import { env } from '../../config/env';
import { donationRepository } from './donation.repository';
import { campaignRepository } from '../campaigns/campaign.repository';
import { userRepository } from '../users/user.repository';
import { donationQueue } from '../../utils/queue';
import { cache } from '../../utils/cache';

export const donationService = {
  createCheckout: async (payload: { campaignId: string; amount: number; userId?: string }) => {
    if (payload.amount <= 0) {
      throw { status: 400, message: 'Invalid donation amount' };
    }

    const campaign = await campaignRepository.findById(payload.campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    if (campaign.status !== 'approved') {
      throw { status: 400, message: 'Campaign is not accepting donations' };
    }

    if (paymentProvider !== 'stripe' || !stripe) {
      throw { status: 400, message: 'Payment provider not configured' };
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(payload.amount * 100),
      currency: 'usd',
      metadata: { campaignId: payload.campaignId, userId: payload.userId ?? '' }
    });

    await donationRepository.create({
      user: payload.userId ? new Types.ObjectId(payload.userId) : undefined,
      campaign: new Types.ObjectId(payload.campaignId),
      amount: payload.amount,
      paymentProvider: 'stripe',
      status: 'pending',
      paymentIntentId: intent.id
    });

    return { clientSecret: intent.client_secret };
  },
  handleWebhook: async (signature: string | string[] | undefined, payload: Buffer) => {
    if (paymentProvider !== 'stripe' || !stripe) {
      throw { status: 400, message: 'Payment provider not configured' };
    }

    if (!signature) {
      throw { status: 400, message: 'Missing webhook signature' };
    }

    const secret = env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw { status: 400, message: 'Stripe webhook secret missing' };
    }

    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as { id: string; amount: number; metadata?: { campaignId?: string; userId?: string } };
      const donation = await donationRepository.updateByPaymentIntentId(intent.id, { status: 'succeeded' });
      if (donation) {
        await campaignRepository.incrementRaisedAmount(donation.campaign.toString(), donation.amount);
        if (donation.user) {
          await userRepository.updateById(donation.user.toString(), { $inc: { totalDonated: donation.amount } } as never);
        }
        await cache.del('stats:global');
        await cache.del('campaigns:featured');
        await cache.invalidateByPrefix('campaigns:list:');
      }
      if (donationQueue) {
        await donationQueue.add('donation_succeeded', { paymentIntentId: intent.id });
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as { id: string };
      await donationRepository.updateByPaymentIntentId(intent.id, { status: 'failed' });
    }

    return { received: true };
  }
};
