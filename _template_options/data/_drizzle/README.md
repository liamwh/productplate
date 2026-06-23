# Drizzle Data Option

Use this when the product needs SQL ownership, existing relational data, joins, reporting, a custom database, or a hosting target where SQL is already the source of truth.

Install only if selected. Examples:

```sh
bun add drizzle-orm postgres
bun add -d drizzle-kit
```

For SQLite, Turso, D1, Neon, PlanetScale, or another driver, choose the matching Drizzle driver and update the client example before activation.

Environment:

```env
DATABASE_URL=
```

Activation checklist:

1. Copy `client.ts.example` to `src/lib/server/db/index.ts`.
2. Copy `schema.ts.example` to `src/lib/server/db/schema.ts`.
3. Add `drizzle.config.ts`.
4. Add migration scripts to package.json.
5. Decide whether Better Auth uses a Drizzle adapter.
6. Replace Convex reads/writes route by route.
7. Remove Convex only after auth, billing, storage, and protected app routes have SQL replacements.

Svelte's official `sv add drizzle` docs list PostgreSQL, MySQL, and SQLite as supported setup paths, with client choices such as postgres.js, neon, mysql2, planetscale, better-sqlite3, libsql, and turso.
