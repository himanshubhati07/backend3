import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PoolClient } from 'pg';
import { query, withTransaction } from '../config/db';
import { env } from '../config/env';
import { AppError } from '../utils/errors';
import { verifyPassword } from '../utils/password';
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens';
import { PublicUser, toPublicUser, userService } from './user.service';

export interface AuthResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  revoked_at: Date | null;
}

// Used to keep login timing similar whether or not the email exists.
const DUMMY_HASH = bcrypt.hashSync(randomUUID(), env.bcryptRounds);

async function issueTokens(user: PublicUser, client?: PoolClient): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refresh = signRefreshToken(user.id);
  await query(
    'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)',
    [randomUUID(), user.id, hashToken(refresh.token), refresh.expiresAt],
    client,
  );
  return { accessToken, refreshToken: refresh.token };
}

export const authService = {
  async register(input: { name: string; email: string; password: string }): Promise<AuthResult> {
    return withTransaction(async (client) => {
      const user = await userService.create({ ...input, role: 'user' }, client);
      return { user, ...(await issueTokens(user, client)) };
    });
  },

  async login(email: string, password: string): Promise<AuthResult> {
    const row = await userService.findRowByEmail(email);
    const valid = await verifyPassword(password, row ? row.password_hash : DUMMY_HASH);
    if (!row || !valid) {
      throw AppError.unauthorized('Invalid email or password');
    }
    if (row.status !== 'active') {
      throw AppError.forbidden('This account is inactive');
    }
    const user = toPublicUser(row);
    return { user, ...(await issueTokens(user)) };
  },

  /** Rotates the refresh token; presenting an already-used token revokes every session of that user. */
  async refresh(token: string): Promise<AuthResult> {
    const payload = verifyRefreshToken(token);
    const rows = await query<RefreshTokenRow>('SELECT * FROM refresh_tokens WHERE token_hash = $1', [hashToken(token)]);
    const stored = rows[0];
    if (!stored || stored.user_id !== payload.sub) {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }
    if (stored.revoked_at) {
      await query('UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL', [
        stored.user_id,
      ]);
      throw AppError.unauthorized('Refresh token reuse detected; please sign in again');
    }
    const userRow = await userService.findRowById(stored.user_id);
    if (!userRow || userRow.status !== 'active') {
      throw AppError.unauthorized('Account is not available');
    }
    const user = toPublicUser(userRow);
    return withTransaction(async (client) => {
      await query('UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1', [stored.id], client);
      return { user, ...(await issueTokens(user, client)) };
    });
  },

  async logout(token: string): Promise<void> {
    await query('UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL', [
      hashToken(token),
    ]);
  },
};
