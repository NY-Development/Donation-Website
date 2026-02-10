import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: env.CORS_ORIGIN.split(',').map((item) => item.trim()),
  credentials: true
};

export const securityMiddlewares = [
  helmet(),
  cors(corsOptions),
  hpp(),
  mongoSanitize()
];
