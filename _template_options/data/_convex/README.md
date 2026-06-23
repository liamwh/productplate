# Convex Data Option

Convex is the active default in Product Plate. Keep it when the product benefits from realtime queries, serverless functions, file storage, typed backend APIs, and fast iteration.

Keep:

- `src/convex`
- `convex-svelte`
- `convex`
- `@convex-dev/better-auth`
- `@useautumn/convex` if Autumn remains selected
- `PUBLIC_CONVEX_URL`
- `PUBLIC_CONVEX_SITE_URL`
- `CONVEX_DEPLOYMENT`

Kickstart tasks:

1. Rename tables and functions only when the product model is clear.
2. Preserve auth-derived authorization. Do not accept user IDs for authorization.
3. Keep `src/convex/_generated/ai/guidelines.md` as the Convex source of truth for agents.
4. Update README.md and AGENTS.md to say `src/convex` is the backend path.
5. Remove Drizzle scaffolds if Convex stays active.
