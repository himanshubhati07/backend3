import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.logLevel,
  base: { service: 'project-backend' },
  redact: ['req.headers.authorization', 'password', 'refreshToken', '*.password', '*.refreshToken'],
});
