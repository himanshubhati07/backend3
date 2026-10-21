import { query } from '../config/db';

export interface HealthReport {
  status: 'up' | 'down';
  timestamp: string;
  database: { status: 'healthy' | 'critical'; latencyMs: number | null };
  memory: { status: 'healthy' | 'warning'; heapUsedMb: number; rssMb: number };
  uptimeSeconds: number;
}

const MEMORY_WARNING_MB = 512;

export const healthService = {
  async check(): Promise<HealthReport> {
    const startedAt = Date.now();
    let database: HealthReport['database'];
    try {
      await query('SELECT 1 AS ok');
      database = { status: 'healthy', latencyMs: Date.now() - startedAt };
    } catch {
      database = { status: 'critical', latencyMs: null };
    }
    const usage = process.memoryUsage();
    const heapUsedMb = Math.round(usage.heapUsed / 1024 / 1024);
    return {
      status: database.status === 'healthy' ? 'up' : 'down',
      timestamp: new Date().toISOString(),
      database,
      memory: {
        status: heapUsedMb > MEMORY_WARNING_MB ? 'warning' : 'healthy',
        heapUsedMb,
        rssMb: Math.round(usage.rss / 1024 / 1024),
      },
      uptimeSeconds: Math.round(process.uptime()),
    };
  },
};
