import { app } from './app';
import { connectDb } from './config/db';
import { env } from './config/env';
import { validatePaymentProvider } from './config/payment';
import { logger } from './utils/logger';

const isServerless = Boolean(process.env.VERCEL);

const bootstrap = async () => {
  validatePaymentProvider();
  await connectDb();
};

const startServer = async () => {
  try {
    await bootstrap();
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

if (isServerless) {
  bootstrap().catch((error) => {
    logger.error('Failed to bootstrap serverless runtime', { error });
  });
} else {
  startServer();
}

export default app;
