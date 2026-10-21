import { z } from 'zod';
import { cleanText } from './sanitize';

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: cleanText(100).optional(),
  sortBy: z.string().trim().max(40).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export function buildPage<T>(items: T[], total: number, page: number, limit: number): Paginated<T> {
  return { items, pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}

/** Maps a user-supplied sort key to a whitelisted SQL column (never interpolates raw input). */
export function resolveSort(
  sortBy: string | undefined,
  order: 'asc' | 'desc',
  allowed: Record<string, string>,
  fallbackKey: string,
): string {
  const column = (sortBy && allowed[sortBy]) || allowed[fallbackKey];
  return `${column} ${order === 'asc' ? 'ASC' : 'DESC'}`;
}

export function likePattern(search: string): string {
  const escaped = search.toLowerCase().replace(/[\\%_]/g, (character) => `\\${character}`);
  return `%${escaped}%`;
}
