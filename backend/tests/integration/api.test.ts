import request from 'supertest';
import { createApp } from '../../src/app';
import * as db from '../../src/config/db';
import { userService } from '../../src/services/user.service';
import { setupTestDatabase } from '../helpers';

const app = createApp();
const api = '/api/v1';

const adminCredentials = { email: 'admin@example.com', password: 'AdminPass1' };
const userCredentials = { name: 'Regular User', email: 'user@example.com', password: 'UserPass123' };

let adminToken: string;
let userToken: string;
let userRefreshToken: string;
let userId: string;

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

beforeAll(async () => {
  await setupTestDatabase();
  await userService.create({ name: 'Admin', ...adminCredentials, role: 'admin' });
  const login = await request(app).post(`${api}/auth/login`).send(adminCredentials);
  adminToken = login.body.data.accessToken;
});

describe('auth', () => {
  it('registers a user and returns tokens without the password hash', async () => {
    const response = await request(app).post(`${api}/auth/register`).send(userCredentials);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.role).toBe('user');
    expect(JSON.stringify(response.body)).not.toMatch(/password/i);
    userToken = response.body.data.accessToken;
    userRefreshToken = response.body.data.refreshToken;
    userId = response.body.data.user.id;
  });

  it('rejects duplicate registration with 409', async () => {
    const response = await request(app).post(`${api}/auth/register`).send(userCredentials);
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it('rejects invalid registration payloads with 400 and field errors', async () => {
    const response = await request(app).post(`${api}/auth/register`).send({ name: '', email: 'bad', password: 'short' });
    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects wrong credentials with 401', async () => {
    const response = await request(app).post(`${api}/auth/login`).send({ email: userCredentials.email, password: 'Wrong123' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('rejects unknown users with the same 401', async () => {
    const response = await request(app).post(`${api}/auth/login`).send({ email: 'nobody@example.com', password: 'Whatever1' });
    expect(response.status).toBe(401);
  });

  it('returns the current user for a valid token and 401 otherwise', async () => {
    const ok = await request(app).get(`${api}/auth/me`).set(bearer(userToken));
    expect(ok.status).toBe(200);
    expect(ok.body.data.email).toBe(userCredentials.email);
    expect((await request(app).get(`${api}/auth/me`)).status).toBe(401);
    expect((await request(app).get(`${api}/auth/me`).set(bearer('garbage'))).status).toBe(401);
  });

  it('rotates refresh tokens and detects reuse', async () => {
    const rotated = await request(app).post(`${api}/auth/refresh`).send({ refreshToken: userRefreshToken });
    expect(rotated.status).toBe(200);
    const newRefresh = rotated.body.data.refreshToken;
    expect(newRefresh).not.toBe(userRefreshToken);

    const reuse = await request(app).post(`${api}/auth/refresh`).send({ refreshToken: userRefreshToken });
    expect(reuse.status).toBe(401);

    // reuse revokes the whole family, so the newer token no longer works either
    const revoked = await request(app).post(`${api}/auth/refresh`).send({ refreshToken: newRefresh });
    expect(revoked.status).toBe(401);
  });

  it('logs out by revoking the refresh token', async () => {
    const login = await request(app).post(`${api}/auth/login`).send(userCredentials);
    const { refreshToken } = login.body.data;
    userToken = login.body.data.accessToken;
    expect((await request(app).post(`${api}/auth/logout`).send({ refreshToken })).status).toBe(200);
    expect((await request(app).post(`${api}/auth/refresh`).send({ refreshToken })).status).toBe(401);
  });
});

describe('users (RBAC)', () => {
  it('forbids regular users from listing users', async () => {
    expect((await request(app).get(`${api}/users`).set(bearer(userToken))).status).toBe(403);
  });

  it('requires authentication', async () => {
    expect((await request(app).get(`${api}/users`)).status).toBe(401);
  });

  it('lets admins list with pagination, filtering, sorting and search', async () => {
    const response = await request(app)
      .get(`${api}/users`)
      .query({ page: 1, limit: 1, sortBy: 'email', order: 'asc', role: 'user', search: 'regular' })
      .set(bearer(adminToken));
    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].email).toBe(userCredentials.email);
    expect(response.body.data.pagination.total).toBe(1);
  });

  it('rejects invalid query parameters', async () => {
    const response = await request(app).get(`${api}/users`).query({ limit: 1000 }).set(bearer(adminToken));
    expect(response.status).toBe(400);
  });

  it('lets admins create, update and delete users', async () => {
    const created = await request(app)
      .post(`${api}/users`)
      .set(bearer(adminToken))
      .send({ name: 'Temp', email: 'temp@example.com', password: 'TempPass123', role: 'user' });
    expect(created.status).toBe(201);
    const id = created.body.data.id;

    const updated = await request(app).patch(`${api}/users/${id}`).set(bearer(adminToken)).send({ status: 'inactive' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe('inactive');

    const blockedLogin = await request(app).post(`${api}/auth/login`).send({ email: 'temp@example.com', password: 'TempPass123' });
    expect(blockedLogin.status).toBe(403);

    expect((await request(app).delete(`${api}/users/${id}`).set(bearer(adminToken))).status).toBe(200);
    expect((await request(app).get(`${api}/users/${id}`).set(bearer(adminToken))).status).toBe(404);
  });

  it('prevents users from escalating their own role', async () => {
    const response = await request(app).patch(`${api}/users/${userId}`).set(bearer(userToken)).send({ role: 'admin' });
    expect(response.status).toBe(403);
  });

  it('rejects malformed ids', async () => {
    expect((await request(app).get(`${api}/users/not-a-uuid`).set(bearer(adminToken))).status).toBe(400);
  });
});

describe('resources', () => {
  let resourceId: string;

  it('creates a resource owned by the caller', async () => {
    const response = await request(app)
      .post(`${api}/resources`)
      .set(bearer(userToken))
      .send({ name: 'Primary DB', description: 'Main <b>database</b>', type: 'database' });
    expect(response.status).toBe(201);
    expect(response.body.data.ownerId).toBe(userId);
    expect(response.body.data.description).toBe('Main bdatabase/b');
    resourceId = response.body.data.id;
  });

  it('rejects duplicate names for the same owner', async () => {
    const response = await request(app).post(`${api}/resources`).set(bearer(userToken)).send({ name: 'Primary DB', type: 'database' });
    expect(response.status).toBe(409);
  });

  it('validates the payload', async () => {
    expect((await request(app).post(`${api}/resources`).set(bearer(userToken)).send({ type: 'x' })).status).toBe(400);
  });

  it('lists only own resources for users and supports search/filter', async () => {
    await request(app).post(`${api}/resources`).set(bearer(adminToken)).send({ name: 'Admin Cache', type: 'cache' });
    const own = await request(app).get(`${api}/resources`).set(bearer(userToken)).query({ search: 'primary', type: 'database' });
    expect(own.body.data.items).toHaveLength(1);
    const all = await request(app).get(`${api}/resources`).set(bearer(userToken));
    expect(all.body.data.pagination.total).toBe(1);
    const adminAll = await request(app).get(`${api}/resources`).set(bearer(adminToken));
    expect(adminAll.body.data.pagination.total).toBe(2);
  });

  it("forbids access to another user's resource but allows admins", async () => {
    const adminList = await request(app).get(`${api}/resources`).set(bearer(adminToken)).query({ search: 'admin cache' });
    const adminResourceId = adminList.body.data.items[0].id;
    expect((await request(app).get(`${api}/resources/${adminResourceId}`).set(bearer(userToken))).status).toBe(403);
    expect((await request(app).get(`${api}/resources/${resourceId}`).set(bearer(adminToken))).status).toBe(200);
  });

  it('updates and deletes a resource', async () => {
    const updated = await request(app).patch(`${api}/resources/${resourceId}`).set(bearer(userToken)).send({ status: 'archived' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe('archived');
    expect((await request(app).delete(`${api}/resources/${resourceId}`).set(bearer(userToken))).status).toBe(200);
    expect((await request(app).get(`${api}/resources/${resourceId}`).set(bearer(userToken))).status).toBe(404);
  });
});

describe('audit', () => {
  it('is admin only and records actions', async () => {
    expect((await request(app).get(`${api}/audit`).set(bearer(userToken))).status).toBe(403);
    const response = await request(app).get(`${api}/audit`).set(bearer(adminToken)).query({ action: 'CREATE', resource: 'resource' });
    expect(response.status).toBe(200);
    expect(response.body.data.items.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data.items[0].action).toBe('CREATE');
  });
});

describe('health, docs and error handling', () => {
  it('reports health', async () => {
    const response = await request(app).get(`${api}/health`);
    expect(response.status).toBe(200);
    expect(response.body.data.database.status).toBe('healthy');
    expect((await request(app).get(`${api}/health/live`)).status).toBe(200);
  });

  it('serves the OpenAPI document and Swagger UI', async () => {
    const json = await request(app).get('/api-docs.json');
    expect(json.status).toBe(200);
    expect(json.body.openapi).toBe('3.0.3');
    expect((await request(app).get('/api-docs/')).status).toBe(200);
  });

  it('returns 404 in the standard error format for unknown routes', async () => {
    const response = await request(app).get(`${api}/nope`);
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ success: false, errors: [] });
  });

  it('returns 400 for malformed JSON', async () => {
    const response = await request(app).post(`${api}/auth/login`).set('Content-Type', 'application/json').send('{bad');
    expect(response.status).toBe(400);
  });

  it('hides internals on server errors and reports 503 when the database is down', async () => {
    const spy = jest.spyOn(db, 'query').mockRejectedValue(new Error('connection refused: secret-host'));
    const health = await request(app).get(`${api}/health`);
    expect(health.status).toBe(503);
    const login = await request(app).post(`${api}/auth/login`).send(adminCredentials);
    expect(login.status).toBe(500);
    expect(login.body.message).toBe('Internal server error');
    expect(JSON.stringify(login.body)).not.toContain('secret-host');
    spy.mockRestore();
  });
});
