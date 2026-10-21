import { randomUUID } from 'crypto';
import { query } from '../config/db';
import { AppError } from '../utils/errors';
import { Paginated, buildPage, likePattern, resolveSort } from '../utils/pagination';
import { Role } from '../utils/tokens';

export interface ResourceRow {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'archived';
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResourceDto {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'archived';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceInput {
  name: string;
  description: string;
  type: string;
  status: 'active' | 'archived';
}

export interface Actor {
  id: string;
  role: Role;
}

export interface ListResourcesFilter {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order: 'asc' | 'desc';
  status?: 'active' | 'archived';
  type?: string;
  ownerId?: string;
}

const SORTABLE = { name: 'name', type: 'type', status: 'status', createdAt: 'created_at', updatedAt: 'updated_at' };

function toDto(row: ResourceRow): ResourceDto {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    status: row.status,
    ownerId: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findOwned(id: string, actor: Actor): Promise<ResourceRow> {
  const rows = await query<ResourceRow>('SELECT * FROM resources WHERE id = $1', [id]);
  const row = rows[0];
  if (!row) {
    throw AppError.notFound('Resource not found');
  }
  if (actor.role !== 'admin' && row.owner_id !== actor.id) {
    throw AppError.forbidden('You can only access your own resources');
  }
  return row;
}

export const resourceService = {
  async create(input: ResourceInput, actor: Actor): Promise<ResourceDto> {
    const duplicate = await query('SELECT id FROM resources WHERE owner_id = $1 AND name = $2', [actor.id, input.name]);
    if (duplicate.length > 0) {
      throw AppError.conflict('You already have a resource with this name');
    }
    const rows = await query<ResourceRow>(
      `INSERT INTO resources (id, name, description, type, status, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [randomUUID(), input.name, input.description, input.type, input.status, actor.id],
    );
    return toDto(rows[0]);
  },

  async getById(id: string, actor: Actor): Promise<ResourceDto> {
    return toDto(await findOwned(id, actor));
  },

  /** Regular users only ever see their own resources; admins may filter by any owner. */
  async list(filter: ListResourcesFilter, actor: Actor): Promise<Paginated<ResourceDto>> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    const ownerId = actor.role === 'admin' ? filter.ownerId : actor.id;
    if (ownerId) {
      params.push(ownerId);
      conditions.push(`owner_id = $${params.length}`);
    }
    if (filter.status) {
      params.push(filter.status);
      conditions.push(`status = $${params.length}`);
    }
    if (filter.type) {
      params.push(filter.type);
      conditions.push(`type = $${params.length}`);
    }
    if (filter.search) {
      params.push(likePattern(filter.search));
      conditions.push(`(LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const totalRows = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM resources ${where}`, params);
    const orderBy = resolveSort(filter.sortBy, filter.order, SORTABLE, 'createdAt');
    const rows = await query<ResourceRow>(
      `SELECT * FROM resources ${where} ORDER BY ${orderBy} LIMIT ${filter.limit} OFFSET ${(filter.page - 1) * filter.limit}`,
      params,
    );
    return buildPage(rows.map(toDto), Number(totalRows[0].count), filter.page, filter.limit);
  },

  async update(id: string, input: Partial<ResourceInput>, actor: Actor): Promise<ResourceDto> {
    const existing = await findOwned(id, actor);
    const name = input.name ?? existing.name;
    if (name !== existing.name) {
      const duplicate = await query('SELECT id FROM resources WHERE owner_id = $1 AND name = $2', [existing.owner_id, name]);
      if (duplicate.length > 0) {
        throw AppError.conflict('You already have a resource with this name');
      }
    }
    const rows = await query<ResourceRow>(
      `UPDATE resources SET name = $2, description = $3, type = $4, status = $5, updated_at = now()
       WHERE id = $1 RETURNING *`,
      [id, name, input.description ?? existing.description, input.type ?? existing.type, input.status ?? existing.status],
    );
    return toDto(rows[0]);
  },

  async remove(id: string, actor: Actor): Promise<void> {
    await findOwned(id, actor);
    await query('DELETE FROM resources WHERE id = $1', [id]);
  },
};
