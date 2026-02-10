import express from 'express';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import { securityMiddlewares } from './config/security';
import { publicLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import campaignRoutes from './modules/campaigns/campaign.routes';
import donationRoutes from './modules/donations/donation.routes';
import adminRoutes from './modules/admin/admin.routes';
import { campaignController } from './modules/campaigns/campaign.controller';

export const app = express();

const jsonParser = express.json({ limit: '2mb' });

app.use('/api/donations/webhook', express.raw({ type: 'application/json' }));
app.use((req, res, next) => {
  if (req.path === '/api/donations/webhook') {
    return next();
  }
  return jsonParser(req, res, next);
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(...securityMiddlewares);
app.use(publicLimiter);

app.use((req, res, next) => {
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.get('/api/stats/global', campaignController.getGlobalStats);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);
