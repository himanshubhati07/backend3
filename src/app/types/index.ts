// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'archived';
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthMetric {
  name: string;
  value: number | string;
  status: 'healthy' | 'warning' | 'critical';
  timestamp?: string;
}

export interface HealthCheckData {
  status: 'up' | 'down';
  timestamp: string;
  database: HealthMetric;
  memory: HealthMetric;
  cpu: HealthMetric;
  uptime: HealthMetric;
  errorCount: HealthMetric;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  tags: string[];
  parameters?: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  requestBody?: {
    description: string;
    required: boolean;
  };
  responses: {
    status: number;
    description: string;
  }[];
}

export interface ToastKind {
  type: 'success' | 'error' | 'info';
}

export interface Toast {
  id: number;
  kind: 'success' | 'error' | 'info';
  message: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
