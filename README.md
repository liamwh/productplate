# Product Plate

A production-minded SvelteKit SaaS starter for indie hackers and founders.

Product Plate provides the infrastructure and product surfaces most SaaS applications need before the differentiating work starts. It is open source, built with ordinary application code, and designed to be changed.

## Included

- SvelteKit 2 and Svelte 5
- Convex functions, realtime data, storage, and typed APIs
- Better Auth with email/password, OAuth hooks, recovery, and protected routes
- Autumn subscription and billing scaffolding
- Vercel AI SDK streaming chat and tool patterns
- Tailwind CSS v4 and shadcn-svelte
- 60+ product, form, data, overlay, navigation, and AI components
- Dashboard, assistant, billing, settings, onboarding, editor, graph, and 3D demo routes
- PWA support and Cloudflare Pages deployment workflow
- Bun-only package management
- Reproducible Devenv shell and process setup

## Quick start

### Devenv

```sh
devenv shell
setup
devenv up
```

`devenv up` runs SvelteKit and Convex together. You can also run them independently with `dev` and `convex-dev`.

### Local tools

```sh
bun install
cp .env.example .env.local
```

Run Convex and SvelteKit in separate terminals:

```sh
bun convex dev
```

```sh
bun dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment

SvelteKit build variables:

- `PUBLIC_CONVEX_URL`
- `PUBLIC_CONVEX_SITE_URL`
- `SITE_URL`

Required Convex variables:

- `SITE_URL`
- `BETTER_AUTH_SECRET`

Optional integration variables:

- `RESEND_API_KEY`
- `RESET_EMAIL_FROM`
- `RESET_EMAIL_REPLY_TO`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `OPENROUTER_API_KEY`
- `AUTUMN_SECRET_KEY`

See [.env.example](.env.example) and [.env.server.example](.env.server.example) for the complete local setup.

## Commands

| Command             | Purpose                                |
| ------------------- | -------------------------------------- |
| `bun dev`           | Start SvelteKit                        |
| `bun convex dev`    | Start Convex development               |
| `bun run check`     | Run Svelte and TypeScript diagnostics  |
| `bun run lint`      | Check formatting and ESLint            |
| `bun run test:unit` | Run Vitest                             |
| `bun run test:e2e`  | Run Playwright                         |
| `bun run build`     | Create a production build              |
| `bun run verify`    | Run lint, check, unit tests, and build |

## Project map

```text
src/routes/                 SvelteKit routes and API handlers
src/routes/(app)/           Authenticated product routes
src/lib/components/ui/      shadcn-svelte primitives
src/lib/components/ai/      AI chat and tool components
src/lib/components/mist/    Adapted Svelte marketing blocks
src/convex/                 Convex schema, auth, billing, and functions
docs/                       Project-specific integration guidance
```

## Deployment

The default production path is Convex plus Cloudflare Pages. The project is configured to deploy at **https://productplate.pages.dev**.

1. Deploy Convex:

   ```sh
   bun convex deploy
   ```

2. Configure production variables in Convex and Cloudflare.

3. Connect the repository to Cloudflare Pages or use the included workflow in `.github/workflows/cloudflare-pages.yml`.

Cloudflare build settings:

- Project name: `productplate`
- Build command: `bun run build`
- Build output: `.svelte-kit/cloudflare`
- Node.js: 22

## Component sources

- Core primitives: [shadcn-svelte](https://www.shadcn-svelte.com/)
- Marketing block foundations: [Svelte Shadcn Blocks](https://sv-blocks.vercel.app/), adapted for Product Plate
- AI interface patterns: [AI Elements](https://ai-sdk.dev/elements)

The imported marketing blocks are MIT licensed. Their structure and styling were adapted to the Product Plate design system and Svelte 5 conventions.

## Contributing

- Use Bun for every package operation.
- Read the project guidance in `AGENTS.md` before editing Svelte or Convex code.
- Add focused tests for behavior changes.
- Run `bun run verify` before opening a pull request.

## License

[MIT](LICENSE)
