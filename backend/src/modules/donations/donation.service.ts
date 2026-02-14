import { stripe, paymentProvider } from '../../config/payment';
import { Types } from 'mongoose';
import { donationRepository } from './donation.repository';
import { campaignRepository } from '../campaigns/campaign.repository';
import { cloudinary } from '../../config/cloudinary';

export const donationService = {
  createCheckout: async (payload: { campaignId: string; amount: number; userId?: string }) => {
    if (payload.amount <= 0) {
      throw { status: 400, message: 'Invalid donation amount' };
    }

    const campaign = await campaignRepository.findById(payload.campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    if (campaign.status === 'paused') {
      throw { status: 400, message: 'Campaign is paused and cannot accept donations' };
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
  verifyCbeDonation: async (payload: {
    campaignId: string;
    amount: number;
    transactionId?: string;
    screenshotBuffer?: Buffer;
    userId?: string;
    donorName?: string;
  }) => {
    if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
      throw { status: 400, message: 'Invalid donation amount' };
    }

    const campaign = await campaignRepository.findById(payload.campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    const trimmedTransactionId = payload.transactionId?.trim();
    if (!trimmedTransactionId && !payload.screenshotBuffer) {
      throw { status: 400, message: 'Transaction ID or QR screenshot is required' };
    }

    let screenshotUpload: { secure_url?: string; public_id?: string } | null = null;
    if (payload.screenshotBuffer) {
      const dataUri = `data:image/png;base64,${payload.screenshotBuffer.toString('base64')}`;
      screenshotUpload = await cloudinary.uploader.upload(dataUri, { folder: 'donations' });
    }

    const donation = await donationRepository.create({
      user: payload.userId ? new Types.ObjectId(payload.userId) : undefined,
      campaign: new Types.ObjectId(payload.campaignId),
      amount: payload.amount,
      paymentProvider: 'cbe',
      status: 'pending',
      transactionId: trimmedTransactionId,
      verificationMethod: trimmedTransactionId ? 'transaction_id' : 'qr_code',
      verificationSource: trimmedTransactionId ? 'MANUAL' : undefined,
      verificationDetails: {
        donorName: payload.donorName,
        screenshotUrl: screenshotUpload?.secure_url,
        screenshotPublicId: screenshotUpload?.public_id,
        submittedAt: new Date()
      }
    });

    return { donationId: donation._id.toString(), pending: true };
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
        const updatedCampaign = await campaignRepository.incrementRaisedAmount(donation.campaign.toString(), donation.amount);
        if (donation.user) {
          await userRepository.updateById(donation.user.toString(), { $inc: { totalDonated: donation.amount } } as never);
        }
        if (updatedCampaign && updatedCampaign.raisedAmount >= updatedCampaign.goalAmount && !updatedCampaign.isSuccessStory) {
          await campaignRepository.updateById(updatedCampaign._id.toString(), {
            isSuccessStory: true,
            goalReachedAt: new Date()
          });
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
