const app = require('./app');
const { config } = require('./config/environment');
const { logger } = require('./utils/logger');

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📍 Environment: ${config.nodeEnv}`);
});
