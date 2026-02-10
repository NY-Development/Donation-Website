import { Queue } from 'bullmq';
import { env } from '../config/env';

type DonationQueue = Pick<Queue, 'add'>;

export const donationQueue: DonationQueue | null = env.REDIS_URL
  ? new Queue('donations', { connection: { url: env.REDIS_URL } })
  : null;
