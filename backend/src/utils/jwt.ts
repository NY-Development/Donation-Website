import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type JwtPayload = {
  userId: string;
  role: 'donor' | 'organizer' | 'admin';
  tokenId?: string;
};

export const signAccessToken = (payload: JwtPayload, expiresIn?: string): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiresIn || env.JWT_EXPIRES_IN });

export const signRefreshToken = (payload: JwtPayload, expiresIn?: string): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: expiresIn || env.JWT_REFRESH_EXPIRES_IN });

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
