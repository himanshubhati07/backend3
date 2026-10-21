import { createApp } from './app';
import { closePool, getPool } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';
import { runMigrations } from './db/migrate';

async function start(): Promise<void> {
  await getPool().query('SELECT 1');
  await runMigrations();

  const app = createApp();
  const server = app.listen(env.port, () => logger.info({ port: env.port }, 'Server listening'));

  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    logger.info({ signal }, 'Shutting down gracefully');
    const forceExit = setTimeout(() => process.exit(1), 10000);
    forceExit.unref();
    server.close(() => {
      closePool()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => logger.error({ err: reason }, 'Unhandled promise rejection'));
}

start().catch((error) => {
  logger.error({ err: error }, 'Failed to start server');
  process.exit(1);
});
