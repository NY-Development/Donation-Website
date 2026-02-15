import express from 'express';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import { connectDb } from './config/db';
import { securityMiddlewares } from './config/security';
import { i18nMiddleware } from './config/i18n';
import { publicLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import campaignRoutes from './modules/campaigns/campaign.routes';
import donationRoutes from './modules/donations/donation.routes';
import adminRoutes from './modules/admin/admin.routes';
import organizerRoutes from './modules/organizer/organizer.routes';
import { campaignController } from './modules/campaigns/campaign.controller';

export const app = express();
app.set('trust proxy', 1);

app.use(i18nMiddleware);

// Database Guard Middleware
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    const t = (req as any).t?.bind(req) ?? ((key: string) => key);
    res.status(503).json({ 
      error: t('errors.dbUnavailable'), 
      message: t('errors.dbUnavailableMessage')
    });
  }
});

const jsonParser = express.json({ limit: '2mb' });

app.use('/api/donations/webhook', express.raw({ type: 'application/json' }));
app.use((req, res, next) => {
  if (req.path === '/api/donations/webhook') return next();
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

// FULL HTML ROOT ROUTE PRESERVED
app.get('/', (_req, res) => {
  res.status(200).type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ImpactGive API</title>
    <style>
      :root {
        color-scheme: light dark;
        --bg: #f5f3f8;
        --card: #ffffff;
        --ink: #0f172a;
        --muted: #64748b;
        --brand: #7f13ec;
        --border: rgba(148, 163, 184, 0.18);
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #120b19;
          --card: #1b1226;
          --ink: #f8fafc;
          --muted: #94a3b8;
          --border: rgba(148, 163, 184, 0.22);
        }
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        background: radial-gradient(circle at top, rgba(127, 19, 236, 0.15), transparent 40%), var(--bg);
        color: var(--ink);
      }
      .wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 32px 20px;
      }
      .card {
        width: min(720px, 100%);
        background: var(--card);
        border-radius: 24px;
        padding: 32px;
        border: 1px solid var(--border);
        box-shadow: 0 25px 60px rgba(15, 23, 42, 0.18);
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(127, 19, 236, 0.12);
        color: var(--brand);
        font-weight: 600;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      h1 { margin: 16px 0 8px; font-size: clamp(28px, 4vw, 36px); }
      p { margin: 0 0 18px; color: var(--muted); line-height: 1.6; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }
      .tile {
        border-radius: 16px;
        padding: 16px;
        border: 1px solid var(--border);
        background: rgba(127, 19, 236, 0.05);
      }
      .tile span {
        display: block;
        font-size: 12px;
        color: var(--muted);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .tile strong { font-size: 18px; }
      a { color: var(--brand); text-decoration: none; font-weight: 600; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="badge">ImpactGive API</div>
        <h1>Backend is live and ready.</h1>
        <p>You have reached the ImpactGive server. Use the API routes to access campaigns, users, and donations.</p>
        <div class="grid">
          <div class="tile"><span>Status</span><strong>Online</strong></div>
          <div class="tile"><span>Health</span><strong>/api/health</strong></div>
          <div class="tile"><span>Docs</span><strong>Coming soon</strong></div>
        </div>
        <p style="margin-top: 18px;">Need to verify? Try <a href="/api/health">/api/health</a>.</p>
      </div>
    </div>
  </body>
</html>`);
});

app.get('/api/health', (req, res) => {
  const t = (req as any).t?.bind(req) ?? ((key: string) => key);
  res.json({ success: true, message: t('health.ok') });
});
app.get('/api/stats/global', campaignController.getGlobalStats);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/organizer', organizerRoutes);

app.use(errorHandler);