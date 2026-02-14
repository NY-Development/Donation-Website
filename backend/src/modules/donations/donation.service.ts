import { stripe, paymentProvider } from '../../config/payment';
import { Types } from 'mongoose';
import { donationRepository } from './donation.repository';
import { campaignRepository } from '../campaigns/campaign.repository';
import { cloudinary } from '../../config/cloudinary';
import { userRepository } from '../users/user.repository';
import { cache } from '../../utils/cache';
import { donationQueue } from '../../utils/queue';
import { env } from '../../config/env';

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
    if (campaign.status === 'closed') {
      throw { status: 400, message: 'Campaign is closed and cannot accept donations' };
    }
    if (campaign.status !== 'approved') {
      throw { status: 400, message: 'Campaign is not accepting donations' };
    }
    if (campaign.deadline && campaign.deadline <= new Date()) {
      await campaignRepository.updateById(payload.campaignId, { status: 'closed', closedAt: new Date() });
      throw { status: 400, message: 'Campaign deadline has passed' };
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
    donorEmail?: string;
  }) => {
    if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
      throw { status: 400, message: 'Invalid donation amount' };
    }

    const campaign = await campaignRepository.findById(payload.campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    if (campaign.status === 'closed') {
      throw { status: 400, message: 'Campaign is closed and cannot accept donations' };
    }
    if (campaign.deadline && campaign.deadline <= new Date()) {
      await campaignRepository.updateById(payload.campaignId, { status: 'closed', closedAt: new Date() });
      throw { status: 400, message: 'Campaign deadline has passed' };
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
      donorName: payload.donorName,
      donorEmail: payload.donorEmail,
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

    const updatedCampaign = await campaignRepository.incrementRaisedAmount(payload.campaignId, payload.amount);
    if (payload.userId) {
      await userRepository.updateById(payload.userId, { $inc: { totalDonated: payload.amount } } as never);
    }
    if (updatedCampaign && updatedCampaign.raisedAmount >= updatedCampaign.goalAmount && !updatedCampaign.isSuccessStory) {
      await campaignRepository.updateById(updatedCampaign._id.toString(), {
        isSuccessStory: true,
        goalReachedAt: new Date(),
        status: 'closed',
        closedAt: new Date()
      });
    }
    await cache.del('stats:global');
    await cache.del('campaigns:featured');
    await cache.invalidateByPrefix('campaigns:list:');

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
            goalReachedAt: new Date(),
            status: 'closed',
            closedAt: new Date()
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
  },
  submitDonation: async (payload: {
    campaignId: string;
    amount: number;
    userId?: string;
    donorName?: string;
    donorEmail?: string;
    receiptBuffer?: Buffer;
  }) => {
    if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
      throw { status: 400, message: 'Invalid donation amount' };
    }

    const campaign = await campaignRepository.findById(payload.campaignId);
    if (!campaign) {
      throw { status: 404, message: 'Campaign not found' };
    }
    if (campaign.status === 'paused') {
      throw { status: 400, message: 'Campaign is paused and cannot accept donations' };
    }
    if (campaign.status === 'closed') {
      throw { status: 400, message: 'Campaign is closed and cannot accept donations' };
    }
    if (campaign.status !== 'approved') {
      throw { status: 400, message: 'Campaign is not accepting donations' };
    }
    if (campaign.deadline && campaign.deadline <= new Date()) {
      await campaignRepository.updateById(payload.campaignId, { status: 'closed', closedAt: new Date() });
      throw { status: 400, message: 'Campaign deadline has passed' };
    }

    let receiptUpload: { secure_url?: string; public_id?: string } | null = null;
    if (payload.receiptBuffer) {
      const dataUri = `data:image/png;base64,${payload.receiptBuffer.toString('base64')}`;
      receiptUpload = await cloudinary.uploader.upload(dataUri, { folder: 'donations' });
    }

    let donorName = payload.donorName?.trim();
    let donorEmail = payload.donorEmail?.trim();
    if (payload.userId && (!donorName || !donorEmail)) {
      const user = await userRepository.findByIdLean(payload.userId);
      if (user) {
        donorName = donorName || user.name;
        donorEmail = donorEmail || user.email;
      }
    }

    const donation = await donationRepository.create({
      user: payload.userId ? new Types.ObjectId(payload.userId) : undefined,
      campaign: new Types.ObjectId(payload.campaignId),
      amount: payload.amount,
      paymentProvider: 'manual',
      status: 'succeeded',
      donorName,
      donorEmail,
      receiptUrl: receiptUpload?.secure_url,
      receiptPublicId: receiptUpload?.public_id
    });

    const updatedCampaign = await campaignRepository.incrementRaisedAmount(payload.campaignId, payload.amount);
    if (payload.userId) {
      await userRepository.updateById(payload.userId, { $inc: { totalDonated: payload.amount } } as never);
    }
    if (updatedCampaign && updatedCampaign.raisedAmount >= updatedCampaign.goalAmount && !updatedCampaign.isSuccessStory) {
      await campaignRepository.updateById(updatedCampaign._id.toString(), {
        isSuccessStory: true,
        goalReachedAt: new Date(),
        status: 'closed',
        closedAt: new Date()
      });
    }

    await cache.del('stats:global');
    await cache.del('campaigns:featured');
    await cache.invalidateByPrefix('campaigns:list:');

    return { donationId: donation._id.toString(), status: donation.status };
  }
};
