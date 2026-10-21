// MOCK DATA — placeholder records for local development only.
// Replace with real API data before production use.

import { User, Resource, AuditLogEntry, ApiEndpoint, HealthCheckData } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    status: 'active',
  },
  {
    id: 'u2',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    createdAt: '2024-01-05T14:30:00Z',
    status: 'active',
  },
  {
    id: 'u3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    createdAt: '2024-01-10T09:15:00Z',
    status: 'active',
  },
  {
    id: 'u4',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'admin',
    createdAt: '2024-01-12T11:45:00Z',
    status: 'active',
  },
];

export const mockResources: Resource[] = [
  {
    id: 'r1',
    name: 'Database Connection Pool',
    description: 'Primary PostgreSQL database instance',
    type: 'database',
    status: 'active',
    owner: 'u1',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-10-20T16:30:00Z',
  },
  {
    id: 'r2',
    name: 'REST API Server',
    description: 'Express.js REST API service',
    type: 'service',
    status: 'active',
    owner: 'u1',
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-10-21T08:15:00Z',
  },
  {
    id: 'r3',
    name: 'File Storage Bucket',
    description: 'S3-compatible file storage',
    type: 'storage',
    status: 'active',
    owner: 'u2',
    createdAt: '2024-01-03T14:20:00Z',
    updatedAt: '2024-10-19T10:45:00Z',
  },
  {
    id: 'r4',
    name: 'Cache Layer',
    description: 'Redis cache instance',
    type: 'cache',
    status: 'active',
    owner: 'u1',
    createdAt: '2024-01-04T08:30:00Z',
    updatedAt: '2024-10-21T09:00:00Z',
  },
  {
    id: 'r5',
    name: 'Message Queue',
    description: 'RabbitMQ message broker',
    type: 'messaging',
    status: 'archived',
    owner: 'u4',
    createdAt: '2024-01-05T16:10:00Z',
    updatedAt: '2024-10-15T13:20:00Z',
  },
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'a1',
    userId: 'u1',
    action: 'CREATE',
    resource: 'User',
    resourceId: 'u3',
    details: 'Created new user account',
    timestamp: '2024-10-21T15:30:00Z',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'a2',
    userId: 'u1',
    action: 'UPDATE',
    resource: 'Resource',
    resourceId: 'r2',
    details: 'Updated resource status to active',
    timestamp: '2024-10-21T14:45:00Z',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'a3',
    userId: 'u2',
    action: 'READ',
    resource: 'User',
    resourceId: 'u2',
    details: 'Accessed user profile',
    timestamp: '2024-10-21T13:20:00Z',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'a4',
    userId: 'u1',
    action: 'DELETE',
    resource: 'Resource',
    resourceId: 'r5',
    details: 'Archived resource',
    timestamp: '2024-10-20T11:10:00Z',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'a5',
    userId: 'u4',
    action: 'UPDATE',
    resource: 'User',
    resourceId: 'u2',
    details: 'Changed user role',
    timestamp: '2024-10-20T09:55:00Z',
    ipAddress: '192.168.1.102',
  },
  {
    id: 'a6',
    userId: 'u1',
    action: 'READ',
    resource: 'AuditLog',
    resourceId: 'a1',
    details: 'Viewed audit logs',
    timestamp: '2024-10-19T16:40:00Z',
    ipAddress: '192.168.1.100',
  },
];

export const mockApiEndpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/users',
    description: 'List all users with pagination, filtering, and sorting',
    tags: ['users'],
    parameters: [
      {
        name: 'page',
        type: 'integer',
        description: 'Page number (0-indexed)',
        required: false,
      },
      {
        name: 'limit',
        type: 'integer',
        description: 'Items per page',
        required: false,
      },
    ],
    responses: [
      { status: 200, description: 'List of users' },
      { status: 401, description: 'Unauthorized' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/users',
    description: 'Create a new user account',
    tags: ['users'],
    requestBody: {
      description: 'User creation payload',
      required: true,
    },
    responses: [
      { status: 201, description: 'User created successfully' },
      { status: 400, description: 'Invalid input' },
      { status: 401, description: 'Unauthorized' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/users/:id',
    description: 'Get user details by ID',
    tags: ['users'],
    responses: [
      { status: 200, description: 'User details' },
      { status: 404, description: 'User not found' },
    ],
  },
  {
    method: 'PUT',
    path: '/api/v1/users/:id',
    description: 'Update user information',
    tags: ['users'],
    requestBody: {
      description: 'User update payload',
      required: true,
    },
    responses: [
      { status: 200, description: 'User updated' },
      { status: 404, description: 'User not found' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/resources',
    description: 'List all resources',
    tags: ['resources'],
    responses: [
      { status: 200, description: 'List of resources' },
      { status: 401, description: 'Unauthorized' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/resources',
    description: 'Create a new resource',
    tags: ['resources'],
    requestBody: {
      description: 'Resource creation payload',
      required: true,
    },
    responses: [
      { status: 201, description: 'Resource created' },
      { status: 400, description: 'Invalid input' },
    ],
  },
];

export const mockHealthCheckData: HealthCheckData = {
  status: 'up',
  timestamp: new Date().toISOString(),
  database: {
    name: 'PostgreSQL',
    value: '95% healthy',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  },
  memory: {
    name: 'Memory Usage',
    value: '62%',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  },
  cpu: {
    name: 'CPU Usage',
    value: '28%',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  },
  uptime: {
    name: 'Uptime',
    value: '45 days',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  },
  errorCount: {
    name: 'Error Rate',
    value: '0.3%',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  },
};
