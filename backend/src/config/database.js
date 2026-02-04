const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { logger } = require('../utils/logger');
const { config } = require('./environment');

// Create connection pool
const pool = new Pool({ connectionString: config.databaseUrl });

// Create Prisma adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: config.nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  await prisma.$disconnect();
  await pool.end();
  logger.info('Database disconnected');
};

module.exports = { prisma, connectDatabase, disconnectDatabase };
