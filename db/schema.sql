CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50),
    stage VARCHAR(30) DEFAULT 'In Review',
    metric_value NUMERIC DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(20) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);