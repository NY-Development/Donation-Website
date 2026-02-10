import Stripe from 'stripe';
import { env } from './env';

export type PaymentProvider = 'stripe' | 'chapa';

export const paymentProvider: PaymentProvider = env.PAYMENT_PROVIDER;

export const stripe = paymentProvider === 'stripe' && env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
  : null;

export const validatePaymentProvider = (): void => {
  if (paymentProvider === 'stripe' && !stripe) {
    throw new Error('Stripe is selected but STRIPE_SECRET_KEY is missing');
  }
  if (paymentProvider === 'chapa' && !env.CHAPA_SECRET_KEY) {
    throw new Error('Chapa is selected but CHAPA_SECRET_KEY is missing');
  }
};
