import { newDb } from 'pg-mem';
import { Pool } from 'pg';
import { setPool } from '../src/config/db';
import { runMigrations } from '../src/db/migrate';

/** Replaces the PostgreSQL pool with a fresh in-memory database and applies all migrations. */
export async function setupTestDatabase(): Promise<void> {
  const database = newDb();
  const { Pool: MemoryPool } = database.adapters.createPg();
  setPool(new MemoryPool() as unknown as Pool);
  await runMigrations();
}
