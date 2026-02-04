const { config } = require('../config/environment');

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}`;
};

const logger = {
  info: (message, meta) => {
    console.log(formatMessage('info', message, meta));
  },

  warn: (message, meta) => {
    console.warn(formatMessage('warn', message, meta));
  },

  error: (message, meta) => {
    console.error(formatMessage('error', message, meta));
  },

  debug: (message, meta) => {
    if (config.nodeEnv === 'development') {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};

module.exports = { logger };
