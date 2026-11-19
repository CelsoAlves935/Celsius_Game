CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

-- Carga inicial do administrador único (senha padrão de dev: celsius123)
INSERT INTO users (id, username, password, role, created_at)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin',
    '$2a$10$FlH9nWs3ylgw3T0srLl6xOxhHr8kxwJUA/JYnWBlkA1eM9GCyFQlW',
    'ADMIN',
    NOW()
);
