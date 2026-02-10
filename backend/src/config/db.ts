import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDb = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_URI);
  logger.info('MongoDB connecte ✅');
};
