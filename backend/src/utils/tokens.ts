import { createHash, randomUUID } from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './errors';

export type Role = 'admin' | 'user';

export interface AccessPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface RefreshPayload {
  sub: string;
  jti: string;
  exp: number;
}

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn as SignOptions['expiresIn'],
  });
}

export function signRefreshToken(userId: string): { token: string; jti: string; expiresAt: Date } {
  const jti = randomUUID();
  const token = jwt.sign({ sub: userId, jti }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as SignOptions['expiresIn'],
  });
  const decoded = jwt.decode(token) as { exp: number };
  return { token, jti, expiresAt: new Date(decoded.exp * 1000) };
}

export function verifyAccessToken(token: string): AccessPayload {
  try {
    return jwt.verify(token, env.jwtAccessSecret) as AccessPayload;
  } catch {
    throw AppError.unauthorized('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): RefreshPayload {
  try {
    return jwt.verify(token, env.jwtRefreshSecret) as RefreshPayload;
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token');
  }
}

/** Refresh tokens are stored only as SHA-256 hashes. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
