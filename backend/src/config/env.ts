import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().optional(),
    JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
    JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    BCRYPT_ROUNDS: z.coerce.number().int().min(4).max(15).default(12),
    CORS_ORIGINS: z.string().default('http://localhost:5173'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
    LOG_LEVEL: z.string().default('info'),
  })
  .refine((value) => value.NODE_ENV === 'test' || !!value.DATABASE_URL, {
    message: 'DATABASE_URL is required',
    path: ['DATABASE_URL'],
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
  throw new Error(`Invalid environment configuration:\n${details.join('\n')}`);
}

const values = parsed.data;

export const env = {
  nodeEnv: values.NODE_ENV,
  isProduction: values.NODE_ENV === 'production',
  port: values.PORT,
  databaseUrl: values.DATABASE_URL,
  jwtAccessSecret: values.JWT_ACCESS_SECRET,
  jwtRefreshSecret: values.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: values.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: values.JWT_REFRESH_EXPIRES_IN,
  bcryptRounds: values.BCRYPT_ROUNDS,
  corsOrigins: values.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
  rateLimitWindowMs: values.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: values.RATE_LIMIT_MAX,
  authRateLimitMax: values.AUTH_RATE_LIMIT_MAX,
  logLevel: values.NODE_ENV === 'test' ? 'silent' : values.LOG_LEVEL,
};
