const paginationParameters = [
  { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
  { name: 'search', in: 'query', schema: { type: 'string' } },
  { name: 'sortBy', in: 'query', schema: { type: 'string' } },
  { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
];

const idParameter = { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } };
const secured = [{ bearerAuth: [] }];

function json(schemaRef: string) {
  return { required: true, content: { 'application/json': { schema: { $ref: `#/components/schemas/${schemaRef}` } } } };
}

function responses(success: number, description: string, ...extra: number[]) {
  const names: Record<number, string> = {
    400: 'Validation failed',
    401: 'Authentication required or invalid credentials',
    403: 'Insufficient permissions',
    404: 'Not found',
    409: 'Conflict',
  };
  const result: Record<string, unknown> = {
    [success]: {
      description,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
    },
  };
  for (const status of extra) {
    result[status] = {
      description: names[status],
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
    };
  }
  return result;
}

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Project API',
    version: '1.0.0',
    description: 'REST API with JWT authentication (access + rotating refresh tokens), RBAC, resources, audit log and health checks.',
  },
  servers: [{ url: '/api/v1' }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Resources' },
    { name: 'Audit' },
    { name: 'Health' },
  ],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: { success: { type: 'boolean', example: true }, message: { type: 'string' }, data: {} },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'array', items: {} },
        },
      },
      Register: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, description: 'Letters and at least one number' },
        },
      },
      Login: {
        type: 'object',
        required: ['email', 'password'],
        properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } },
      },
      RefreshToken: {
        type: 'object',
        required: ['refreshToken'],
        properties: { refreshToken: { type: 'string' } },
      },
      CreateUser: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          role: { type: 'string', enum: ['admin', 'user'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
        },
      },
      UpdateUser: {
        type: 'object',
        description: 'Any subset of CreateUser fields; role/status are admin-only.',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          role: { type: 'string', enum: ['admin', 'user'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
        },
      },
      ResourceInput: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string', enum: ['active', 'archived'] },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: { tags: ['Auth'], summary: 'Register a new user', requestBody: json('Register'), responses: responses(201, 'Registered', 400, 409) },
    },
    '/auth/login': {
      post: { tags: ['Auth'], summary: 'Login and receive tokens', requestBody: json('Login'), responses: responses(200, 'Logged in', 400, 401, 403) },
    },
    '/auth/refresh': {
      post: { tags: ['Auth'], summary: 'Rotate refresh token', requestBody: json('RefreshToken'), responses: responses(200, 'New token pair', 400, 401) },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Revoke a refresh token', requestBody: json('RefreshToken'), responses: responses(200, 'Logged out', 400) },
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: 'Current user', security: secured, responses: responses(200, 'Current user', 401) },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users (admin)',
        security: secured,
        parameters: [
          ...paginationParameters,
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'user'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive'] } },
        ],
        responses: responses(200, 'Paginated users', 400, 401, 403),
      },
      post: { tags: ['Users'], summary: 'Create user (admin)', security: secured, requestBody: json('CreateUser'), responses: responses(201, 'Created', 400, 401, 403, 409) },
    },
    '/users/{id}': {
      get: { tags: ['Users'], summary: 'Get user (self or admin)', security: secured, parameters: [idParameter], responses: responses(200, 'User', 400, 401, 403, 404) },
      patch: { tags: ['Users'], summary: 'Update user (self or admin)', security: secured, parameters: [idParameter], requestBody: json('UpdateUser'), responses: responses(200, 'Updated', 400, 401, 403, 404, 409) },
      delete: { tags: ['Users'], summary: 'Delete user (admin)', security: secured, parameters: [idParameter], responses: responses(200, 'Deleted', 400, 401, 403, 404, 409) },
    },
    '/resources': {
      get: {
        tags: ['Resources'],
        summary: 'List resources (own resources; admins see all)',
        security: secured,
        parameters: [
          ...paginationParameters,
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'archived'] } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'ownerId', in: 'query', description: 'Admin only', schema: { type: 'string', format: 'uuid' } },
        ],
        responses: responses(200, 'Paginated resources', 400, 401),
      },
      post: { tags: ['Resources'], summary: 'Create resource', security: secured, requestBody: json('ResourceInput'), responses: responses(201, 'Created', 400, 401, 409) },
    },
    '/resources/{id}': {
      get: { tags: ['Resources'], summary: 'Get resource', security: secured, parameters: [idParameter], responses: responses(200, 'Resource', 400, 401, 403, 404) },
      patch: { tags: ['Resources'], summary: 'Update resource', security: secured, parameters: [idParameter], requestBody: json('ResourceInput'), responses: responses(200, 'Updated', 400, 401, 403, 404, 409) },
      delete: { tags: ['Resources'], summary: 'Delete resource', security: secured, parameters: [idParameter], responses: responses(200, 'Deleted', 400, 401, 403, 404) },
    },
    '/audit': {
      get: {
        tags: ['Audit'],
        summary: 'List audit log entries (admin)',
        security: secured,
        parameters: [
          ...paginationParameters,
          { name: 'userId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'action', in: 'query', schema: { type: 'string' } },
          { name: 'resource', in: 'query', schema: { type: 'string' } },
        ],
        responses: responses(200, 'Paginated audit entries', 400, 401, 403),
      },
    },
    '/health': { get: { tags: ['Health'], summary: 'Readiness check (database, memory, uptime)', responses: responses(200, 'Healthy') } },
    '/health/live': { get: { tags: ['Health'], summary: 'Liveness probe', responses: responses(200, 'Alive') } },
  },
};
