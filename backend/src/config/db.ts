import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDb = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  mongoose.set('bufferTimeoutMS', 20000);
  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000
  });
  logger.info('MongoDB connecte ✅');
};
