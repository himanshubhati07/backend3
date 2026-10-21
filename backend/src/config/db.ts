import { Pool, PoolClient, QueryResultRow } from 'pg';
import { env } from './env';
import { logger } from './logger';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: env.databaseUrl, max: 10, connectionTimeoutMillis: 5000 });
    pool.on('error', (error) => logger.error({ err: error }, 'Unexpected PostgreSQL pool error'));
  }
  return pool;
}

/** Allows tests to inject an in-memory pool. */
export function setPool(replacement: Pool): void {
  pool = replacement;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
  client?: PoolClient,
): Promise<T[]> {
  const executor = client ?? getPool();
  const result = await executor.query<T>(text, params);
  return result.rows;
}

export async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
