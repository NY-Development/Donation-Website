import { app } from './app';
import { env } from './config/env';
import { validatePaymentProvider } from './config/payment';
import { logger } from './utils/logger';

const isServerless = Boolean(process.env.VERCEL);

const startServer = async () => {
  try {
    validatePaymentProvider();

    if (!isServerless) {
      const serverPort = env.PORT || 3000;
      app.listen(serverPort, () => {
        // Explicit log you requested:
        logger.info(`SERVER_STATUS: Online ✅ | LISTENING_ON_PORT: ${serverPort}`);
      });
    } else {
      logger.info('RUNTIME_MODE: Serverless (Vercel) ☁️');
    }
  } catch (error) {
    logger.error('SERVER_BOOT_FAILED 💥', { error });
    process.exit(1);
  }
};

startServer();

export default app;