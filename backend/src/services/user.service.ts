import { randomUUID } from 'crypto';
import { PoolClient } from 'pg';
import { query } from '../config/db';
import { AppError } from '../utils/errors';
import { Paginated, buildPage, likePattern, resolveSort } from '../utils/pagination';
import { hashPassword } from '../utils/password';
import { Role } from '../utils/tokens';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
  status?: 'active' | 'inactive';
}

export interface ListUsersFilter {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order: 'asc' | 'desc';
  role?: Role;
  status?: 'active' | 'inactive';
}

const SORTABLE = { name: 'name', email: 'email', role: 'role', status: 'status', createdAt: 'created_at' };

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const userService = {
  async findRowByEmail(email: string): Promise<UserRow | undefined> {
    const rows = await query<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async findRowById(id: string): Promise<UserRow | undefined> {
    const rows = await query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  },

  async getById(id: string): Promise<PublicUser> {
    const row = await this.findRowById(id);
    if (!row) {
      throw AppError.notFound('User not found');
    }
    return toPublicUser(row);
  },

  async create(input: CreateUserInput, client?: PoolClient): Promise<PublicUser> {
    if (await this.findRowByEmail(input.email)) {
      throw AppError.conflict('A user with this email already exists');
    }
    const passwordHash = await hashPassword(input.password);
    const rows = await query<UserRow>(
      `INSERT INTO users (id, name, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [randomUUID(), input.name, input.email, passwordHash, input.role ?? 'user', input.status ?? 'active'],
      client,
    );
    return toPublicUser(rows[0]);
  },

  async list(filter: ListUsersFilter): Promise<Paginated<PublicUser>> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter.search) {
      params.push(likePattern(filter.search));
      conditions.push(`(LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`);
    }
    if (filter.role) {
      params.push(filter.role);
      conditions.push(`role = $${params.length}`);
    }
    if (filter.status) {
      params.push(filter.status);
      conditions.push(`status = $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const totalRows = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM users ${where}`, params);
    const orderBy = resolveSort(filter.sortBy, filter.order, SORTABLE, 'createdAt');
    const rows = await query<UserRow>(
      `SELECT * FROM users ${where} ORDER BY ${orderBy} LIMIT ${filter.limit} OFFSET ${(filter.page - 1) * filter.limit}`,
      params,
    );
    return buildPage(rows.map(toPublicUser), Number(totalRows[0].count), filter.page, filter.limit);
  },

  async update(id: string, input: Partial<CreateUserInput>): Promise<PublicUser> {
    const existing = await this.findRowById(id);
    if (!existing) {
      throw AppError.notFound('User not found');
    }
    if (input.email && input.email !== existing.email && (await this.findRowByEmail(input.email))) {
      throw AppError.conflict('A user with this email already exists');
    }
    const passwordHash = input.password ? await hashPassword(input.password) : existing.password_hash;
    const rows = await query<UserRow>(
      `UPDATE users SET name = $2, email = $3, password_hash = $4, role = $5, status = $6, updated_at = now()
       WHERE id = $1 RETURNING *`,
      [
        id,
        input.name ?? existing.name,
        input.email ?? existing.email,
        passwordHash,
        input.role ?? existing.role,
        input.status ?? existing.status,
      ],
    );
    return toPublicUser(rows[0]);
  },

  async remove(id: string): Promise<void> {
    const existing = await this.findRowById(id);
    if (!existing) {
      throw AppError.notFound('User not found');
    }
    const owned = await query<{ count: string }>('SELECT COUNT(*) AS count FROM resources WHERE owner_id = $1', [id]);
    if (Number(owned[0].count) > 0) {
      throw AppError.conflict('User still owns resources; reassign or delete them first');
    }
    await query('UPDATE audit_logs SET user_id = NULL WHERE user_id = $1', [id]);
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [id]);
    await query('DELETE FROM users WHERE id = $1', [id]);
  },
};
