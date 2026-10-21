import { z } from 'zod';
import { cleanText, } from '../utils/sanitize';
import { listQuerySchema } from '../utils/pagination';

const email = z.string().trim().toLowerCase().email().max(254);
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');
const uuid = z.string().uuid();

export const idParamsSchema = z.object({ id: uuid });

// ---- auth ----
export const registerSchema = z.object({ name: cleanText(100), email, password });
export const loginSchema = z.object({ email, password: z.string().min(1).max(128) });
export const refreshSchema = z.object({ refreshToken: z.string().min(10) });

// ---- users ----
export const createUserSchema = z.object({
  name: cleanText(100),
  email,
  password,
  role: z.enum(['admin', 'user']).default('user'),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updateUserSchema = z
  .object({
    name: cleanText(100),
    email,
    password,
    role: z.enum(['admin', 'user']),
    status: z.enum(['active', 'inactive']),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'At least one field must be provided' });

export const listUsersQuerySchema = listQuerySchema.extend({
  role: z.enum(['admin', 'user']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// ---- resources ----
export const createResourceSchema = z.object({
  name: cleanText(150),
  description: z.string().transform((value) => value.replace(/[<>]/g, '').trim()).pipe(z.string().max(1000)).default(''),
  type: cleanText(50),
  status: z.enum(['active', 'archived']).default('active'),
});

export const updateResourceSchema = createResourceSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'At least one field must be provided' });

export const listResourcesQuerySchema = listQuerySchema.extend({
  status: z.enum(['active', 'archived']).optional(),
  type: cleanText(50).optional(),
  ownerId: uuid.optional(),
});

// ---- audit ----
export const listAuditQuerySchema = listQuerySchema.extend({
  userId: uuid.optional(),
  action: cleanText(50).optional(),
  resource: cleanText(50).optional(),
});
