import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../utils/api-response';

export const globalRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => sendError(res, 429, 'Too many requests, please try again later'),
});

/** Stricter limiter for credential endpoints (login/register/refresh). */
export const authRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.authRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => sendError(res, 429, 'Too many authentication attempts, please try again later'),
});
