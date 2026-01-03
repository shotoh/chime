CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    last_updated BIGINT NOT NULL,
    root_group JSON NOT NULL
);