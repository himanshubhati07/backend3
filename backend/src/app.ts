import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './config/logger';
import { openApiSpec } from './docs/openapi';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { globalRateLimiter } from './middleware/rate-limit';
import { apiRouter } from './routes';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Swagger UI needs inline assets, so it is mounted before the strict helmet policy.
  app.use('/api-docs', helmet({ contentSecurityPolicy: false }), swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get('/api-docs.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Origin not allowed by CORS'));
      },
      credentials: true,
    }),
  );
  app.use(globalRateLimiter);
  app.use(express.json({ limit: '100kb' }));
  app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on('finish', () => {
      logger.info({ method: req.method, url: req.originalUrl, status: res.statusCode, ms: Date.now() - startedAt }, 'request');
    });
    next();
  });

  app.use('/api/v1', apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
