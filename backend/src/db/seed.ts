import { closePool } from '../config/db';
import { logger } from '../config/logger';
import { userService } from '../services/user.service';
import { runMigrations } from './migrate';

/** Creates the first administrator from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (no credentials live in code). */
async function seed(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set');
  }
  await runMigrations();
  if (await userService.findRowByEmail(email)) {
    logger.info('Admin already exists, nothing to do');
    return;
  }
  await userService.create({ name: 'Administrator', email, password, role: 'admin' });
  logger.info({ email }, 'Admin user created');
}

seed()
  .then(() => closePool())
  .catch((error) => {
    logger.error({ err: error }, 'Seeding failed');
    process.exit(1);
  });
