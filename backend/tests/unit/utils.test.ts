import { buildPage, likePattern, resolveSort } from '../../src/utils/pagination';
import { hashPassword, verifyPassword } from '../../src/utils/password';
import { sanitizeText } from '../../src/utils/sanitize';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../src/utils/tokens';

describe('password utils', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('Secret123');
    expect(hash).not.toBe('Secret123');
    await expect(verifyPassword('Secret123', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong', hash)).resolves.toBe(false);
  });
});

describe('token utils', () => {
  it('signs and verifies access tokens', () => {
    const token = signAccessToken({ sub: 'u1', email: 'a@b.co', role: 'admin' });
    expect(verifyAccessToken(token)).toMatchObject({ sub: 'u1', role: 'admin' });
  });

  it('rejects tampered access tokens', () => {
    expect(() => verifyAccessToken('not.a.token')).toThrow('Invalid or expired access token');
  });

  it('signs refresh tokens with a unique jti and future expiry', () => {
    const first = signRefreshToken('u1');
    const second = signRefreshToken('u1');
    expect(first.jti).not.toBe(second.jti);
    expect(first.expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(verifyRefreshToken(first.token).sub).toBe('u1');
  });

  it('does not accept an access token as a refresh token', () => {
    const access = signAccessToken({ sub: 'u1', email: 'a@b.co', role: 'user' });
    expect(() => verifyRefreshToken(access)).toThrow();
  });

  it('hashes tokens deterministically', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'));
    expect(hashToken('abc')).toHaveLength(64);
  });
});

describe('pagination utils', () => {
  it('builds page metadata', () => {
    expect(buildPage([1, 2], 45, 2, 20).pagination).toEqual({ page: 2, limit: 20, total: 45, totalPages: 3 });
    expect(buildPage([], 0, 1, 20).pagination.totalPages).toBe(1);
  });

  it('only sorts by whitelisted columns', () => {
    const allowed = { name: 'name', createdAt: 'created_at' };
    expect(resolveSort('name', 'asc', allowed, 'createdAt')).toBe('name ASC');
    expect(resolveSort('id; DROP TABLE users', 'desc', allowed, 'createdAt')).toBe('created_at DESC');
  });

  it('escapes LIKE wildcards', () => {
    expect(likePattern('50%_Off')).toBe('%50\\%\\_off%');
  });
});

describe('sanitizeText', () => {
  it('strips angle brackets and control characters', () => {
    expect(sanitizeText('  <script>alert(1)</script>\u0007 ')).toBe('scriptalert(1)/script');
  });
});
