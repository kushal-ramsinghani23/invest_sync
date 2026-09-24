# InvestSync

Real-time investment/company tracking dashboard with live metric updates via WebSockets.

## Stack
Node.js, Express, PostgreSQL, Socket.io, Angular

## Setup
1. `npm install`
2. Create `.env` (see `.env.example`)
3. Run schema: `psql -U postgres -d investsync -f db/schema.sql`
4. `node server.js`

## API Reference

| Method | Endpoint         | Body                                              | Description         |
|--------|------------------|----------------------------------------------------|----------------------|
| GET    | /companies       | —                                                  | List all companies  |
| POST   | /companies       | `{ name, sector, stage, metric_value }`            | Create a company    |
| PUT    | /companies/:id   | `{ name, sector, stage, metric_value }`            | Update a company    |
| DELETE | /companies/:id   | —                                                  | Delete a company    |