CREATE TABLE games (
    id UUID PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    rating NUMERIC(3, 1),
    hours_played INTEGER DEFAULT 0,
    cover_url VARCHAR(500),
    review TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

-- Índices para otimizar os filtros mais frequentes do catálogo público
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_platform ON games(platform);

