CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50),
    stage VARCHAR(30) DEFAULT 'In Review',
    metric_value NUMERIC DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);