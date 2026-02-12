import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let isConnected = false;

export const connectDb = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    mongoose.set('bufferCommands', false);

    const db = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = !!db.connections[0].readyState;
    
    // Explicit log you requested:
    logger.info(`DATABASE_CONNECTED: ${isConnected} (readyState: ${mongoose.connection.readyState}) ✅`);
    
  } catch (error) {
    logger.error('DATABASE_CONNECTION_FAILED ❌', { error });
    isConnected = false;
    throw error;
  }
};