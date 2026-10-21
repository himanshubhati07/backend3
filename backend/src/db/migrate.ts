import { closePool, query, withTransaction } from '../config/db';
import { logger } from '../config/logger';
import { migrations } from './migrations';

/** Applies every pending migration, each inside its own transaction. */
export async function runMigrations(): Promise<string[]> {
  await query(
    'CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())',
  );
  const applied = new Set((await query<{ id: string }>('SELECT id FROM schema_migrations')).map((row) => row.id));
  const executed: string[] = [];

  for (const migration of migrations) {
    if (applied.has(migration.id)) {
      continue;
    }
    await withTransaction(async (client) => {
      await query(migration.sql, [], client);
      await query('INSERT INTO schema_migrations (id) VALUES ($1)', [migration.id], client);
    });
    executed.push(migration.id);
    logger.info({ migration: migration.id }, 'Migration applied');
  }
  return executed;
}

if (require.main === module) {
  runMigrations()
    .then((executed) => {
      logger.info({ executed }, 'Migrations complete');
      return closePool();
    })
    .catch((error) => {
      logger.error({ err: error }, 'Migration failed');
      process.exit(1);
    });
}
