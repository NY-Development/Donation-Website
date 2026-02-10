import { app } from './app';
import { connectDb } from './config/db';
import { env } from './config/env';
import { validatePaymentProvider } from './config/payment';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    validatePaymentProvider();
    await connectDb();

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();
