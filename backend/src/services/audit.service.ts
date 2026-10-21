import { randomUUID } from 'crypto';
import { query } from '../config/db';
import { logger } from '../config/logger';
import { Paginated, buildPage, likePattern, resolveSort } from '../utils/pagination';

export interface AuditRow {
  id: string;
  user_id: string | null;
  action: string;
  resource: string;
  resource_id: string;
  details: string;
  ip_address: string;
  created_at: Date;
}

export interface AuditEntry {
  id: string;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  timestamp: Date;
}

export interface RecordAuditInput {
  userId: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
}

export interface ListAuditFilter {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order: 'asc' | 'desc';
  userId?: string;
  action?: string;
  resource?: string;
}

const SORTABLE = { timestamp: 'created_at', action: 'action', resource: 'resource' };

function toEntry(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    userId: row.user_id,
    action: row.action,
    resource: row.resource,
    resourceId: row.resource_id,
    details: row.details,
    ipAddress: row.ip_address,
    timestamp: row.created_at,
  };
}

export const auditService = {
  /** Audit failures are logged but never fail the business operation. */
  async record(input: RecordAuditInput): Promise<void> {
    try {
      await query(
        `INSERT INTO audit_logs (id, user_id, action, resource, resource_id, details, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [randomUUID(), input.userId, input.action, input.resource, input.resourceId ?? '', input.details ?? '', input.ipAddress ?? ''],
      );
    } catch (error) {
      logger.error({ err: error }, 'Failed to write audit log');
    }
  },

  async list(filter: ListAuditFilter): Promise<Paginated<AuditEntry>> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter.userId) {
      params.push(filter.userId);
      conditions.push(`user_id = $${params.length}`);
    }
    if (filter.action) {
      params.push(filter.action);
      conditions.push(`action = $${params.length}`);
    }
    if (filter.resource) {
      params.push(filter.resource);
      conditions.push(`resource = $${params.length}`);
    }
    if (filter.search) {
      params.push(likePattern(filter.search));
      conditions.push(`LOWER(details) LIKE $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const totalRows = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM audit_logs ${where}`, params);
    const orderBy = resolveSort(filter.sortBy, filter.order, SORTABLE, 'timestamp');
    const rows = await query<AuditRow>(
      `SELECT * FROM audit_logs ${where} ORDER BY ${orderBy} LIMIT ${filter.limit} OFFSET ${(filter.page - 1) * filter.limit}`,
      params,
    );
    return buildPage(rows.map(toEntry), Number(totalRows[0].count), filter.page, filter.limit);
  },
};
