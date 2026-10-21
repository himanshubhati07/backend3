export interface Migration {
  id: string;
  sql: string;
}

export const migrations: Migration[] = [
  {
    id: '001_initial_schema',
    sql: `
      CREATE TABLE users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_users_role ON users (role);
      CREATE INDEX idx_users_status ON users (status);
      CREATE INDEX idx_users_created_at ON users (created_at);

      CREATE TABLE resources (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
        owner_id UUID NOT NULL REFERENCES users (id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (owner_id, name)
      );
      CREATE INDEX idx_resources_owner_id ON resources (owner_id);
      CREATE INDEX idx_resources_status ON resources (status);
      CREATE INDEX idx_resources_type ON resources (type);
      CREATE INDEX idx_resources_created_at ON resources (created_at);

      CREATE TABLE audit_logs (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users (id),
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        resource_id TEXT NOT NULL DEFAULT '',
        details TEXT NOT NULL DEFAULT '',
        ip_address TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);
      CREATE INDEX idx_audit_logs_action ON audit_logs (action);
      CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);

      CREATE TABLE refresh_tokens (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users (id),
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
    `,
  },
];
