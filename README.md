// ...existing code...
# Expense Tracker (TypeScript)

A simple expense tracker API built with Fastify, Knex and SQLite. Useful as a minimal scaffold for learning and bootstrapping small projects.

## Overview

- Fastify application instance: [`app`](src/app.ts) ([src/app.ts](src/app.ts))
- Entrypoint that starts the server: [`server`](src/server.ts) ([src/server.ts](src/server.ts))
- Environment validation: [`env`](src/env/index.ts) ([src/env/index.ts](src/env/index.ts))
- Database configuration and exports: [`config`](src/database.ts) and [`knex`](src/database.ts) ([src/database.ts](src/database.ts))
- Transactions routes: [`transactionsRoutes`](src/routes/transactions.ts) ([src/routes/transactions.ts](src/routes/transactions.ts))
- Session middleware: [`checkSessionIdExists`](src/middlewares/check-session-id-exists.ts) ([src/middlewares/check-session-id-exists.ts](src/middlewares/check-session-id-exists.ts))
- Knex configuration file: [knexfile.ts](knexfile.ts)
- Migrations:
  - [db/migrations/20250329184443_create_transactions_table.ts](db/migrations/20250329184443_create_transactions_table.ts)
  - [db/migrations/20250329184743_add-session-id-to-transactions.ts](db/migrations/20250329184743_add-session-id-to-transactions.ts)
- Tests: [test/transactions.spec.ts](test/transactions.spec.ts)
- Project configuration: [package.json](package.json) and [tsconfig.json](tsconfig.json)

## Features

- Create, list, fetch and summarize transactions per session (cookie-based).
- Uses UUIDs for transaction IDs and session IDs.
- Simple SQLite + Knex migration setup.

## Requirements

- Node.js >= 18
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy or configure environment files:
- Use [.env.example](.env.example) for local development.
- Use [.env.test](.env.test) for running tests.

## Database

- The Knex configuration is exported from [`src/database.ts`](src/database.ts).
- Run migrations with the included npm shortcut for Knex:

```bash
# Run latest migrations
npm run knex migrate:latest

# Rollback all migrations
npm run knex migrate:rollback --all
```

## Scripts (from package.json)

- Start dev server (watch): npm run dev
- Run Knex CLI: npm run knex
- Run linter: npm run lint
- Run tests: npm run test

Example:
```bash
npm run dev
npm run knex migrate:latest
npm run test
```

## API (summary)

- POST /transactions
  - body: { description: string, amount: number, type: "credit" | "debit" }
  - Creates a transaction and sets a `sessionId` cookie (if missing).

- GET /transactions
  - Requires `sessionId` cookie (middleware: [`checkSessionIdExists`](src/middlewares/check-session-id-exists.ts))
  - Returns the list of transactions for the session.

- GET /transactions/:id
  - Returns a single transaction for the session.

- GET /transactions/summary
  - Returns the sum of amounts for the session.

Routes are implemented in [`transactionsRoutes`](src/routes/transactions.ts).

## Testing

- Tests use Vitest and Supertest: see [test/transactions.spec.ts](test/transactions.spec.ts).
- The test suite runs migrations before each test run (the test file uses the `knex` CLI via npm scripts).

## Project layout

- [src/app.ts](src/app.ts) — Fastify app and route registration
- [src/server.ts](src/server.ts) — server start
- [src/env/index.ts](src/env/index.ts) — environment parsing and validation
- [src/database.ts](src/database.ts) — Knex config and instance
- [src/routes/transactions.ts](src/routes/transactions.ts) — transactions handlers
- [src/middlewares/check-session-id-exists.ts](src/middlewares/check-session-id-exists.ts) — middleware
- [db/migrations](db/migrations) — database migrations
- [test/transactions.spec.ts](test/transactions.spec.ts) — integration tests

## Notes

- The project uses cookie-based sessions (no auth). Transactions are scoped by `sessionId`.
- SQLite DB files are ignored in `.gitignore` (`db/app.db`).

Contributions and issues are welcome.