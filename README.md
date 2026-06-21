# Product Plate – A production‑ready SaaS starter for SvelteKit

<!-- Optional: Add a custom hero image to `docs/images/hero.png` and reference it here -->

Product Plate is an **MIT‑licensed, open‑source** SaaS boilerplate built on **SvelteKit 2/Svelte 5** and **Convex**. It packages the infrastructure and product surfaces most SaaS apps need – authentication, subscriptions, realtime data, AI patterns, UI components, deployment scripts and more – so you can focus on delivering your unique value.

## Why Product Plate?

Developers on Reddit often note that boilerplates are useful when they save time on the boring infrastructure tasks (auth, payments, email) but worry about cost, licensing and long‑term maintenance【996661270482647†L150-L167】. They also want to pick a stack they’re comfortable with【79898782278230†L70-L85】, choose modules like auth provider or database【996661270482647†L358-L362】 and avoid vendor lock‑in【79898782278230†L230-L239】.

Product Plate responds to those pain points:

- **Free & MIT licensed** – no paywall, no restrictive license. Clone, build and ship.
- **Built on SvelteKit + Convex** – modern technology with real‑time backend, typed APIs and file‑based routes.
- **Modular** – swap or extend auth providers (Better Auth), databases (Convex), billing (Autumn, Stripe) and UI libraries.
- **Vendor‑agnostic** – deploy on Vercel or Cloudflare Pages, self‑host your Convex deployment, and avoid lock‑in.
- **Actively maintained** – updated for Svelte 5 and includes PWA support, AI assistant patterns and more.

## Features

- **Authentication** – email/password with password recovery; OAuth providers (GitHub, Google) via Better Auth.
- **Subscriptions & billing** – integrated with Autumn for recurring payments and invoicing; can be swapped for Stripe.
- **Realtime & storage** – Convex functions provide typed APIs, realtime queries and file storage.
- **AI assistant patterns** – integrates the Vercel AI SDK for streaming chat, tool calling and assistants.
- **UI kit** – Tailwind v4, shadcn‑svelte primitives and over 60 pre‑built components (forms, modals, charts, editors, nav).
- **Example routes** – ready‑to‑ship dashboard, billing portal, settings, onboarding wizard, graphs and 3D demo.
- **Developer experience** – Bun‑only package management, reproducible Devenv shell, Vitest/Playwright tests and CI workflows.
- **PWA & deployment** – configured for Cloudflare Pages and Convex; can deploy anywhere.

## Live demo

Visit **[productplate.pages.dev](https://productplate.pages.dev)** to explore the landing page and demo routes. Create an account to see the dashboard, assistant chat and billing flows in action.

*(Insert a screenshot of the dashboard here. You can capture it from the live demo and place it in `docs/images/dashboard.png`.)*

## Quick start

Use `devenv` for a containerised, reproducible development environment:

```sh
devenv shell
setup     # installs Bun and Convex CLI
devenv up # runs SvelteKit and Convex together
```

Or work locally with Bun:

```sh
bun install
cp .env.example .env.local
bun convex dev     # start Convex backend
bun dev            # start SvelteKit
```

Open http://localhost:5173 in your browser. See `.env.example` and `.env.server.example` for environment variables.

### Commands

| Command               | Purpose                                |
|-----------------------|----------------------------------------|
| `bun dev`             | Start SvelteKit                        |
| `bun convex dev`      | Start Convex in development            |
| `bun run check`       | Run Svelte and TypeScript diagnostics  |
| `bun run lint`        | Check formatting and ESLint            |
| `bun run test:unit`   | Run Vitest tests                       |
| `bun run test:e2e`    | Run Playwright end‑to‑end tests        |
| `bun run build`       | Create a production build              |
| `bun run verify`      | Run lint, check, unit tests, and build |

## Project structure

```
src/routes/                 SvelteKit routes and API handlers
src/routes/(app)/           Authenticated product routes
src/lib/components/ui/      shadcn-svelte primitives
src/lib/components/ai/      AI chat and tool components
src/lib/components/mist/    Adapted marketing blocks
src/convex/                 Convex schema, auth, billing, functions
docs/                       Integration guides and explanations
```

## Deployment

Product Plate deploys by default on **Convex** + **Cloudflare Pages**:

1. Deploy Convex:

   ```sh
   bun convex deploy
   ```

2. Configure production variables in Convex and Cloudflare.

3. Connect the repository to Cloudflare Pages or use the `.github/workflows/cloudflare-pages.yml` workflow.

See `docs/deployment.md` for alternative deployment targets (Vercel, self‑hosted Convex).

## Contributing

Contributions are welcome! Read `AGENTS.md` for guidelines. Use Bun for package scripts and run `bun run verify` before submitting a PR.

---

Made with ❤️ by [Rodrigo Dias](https://github.com/rodrgds). Product Plate is released under the [MIT License](LICENSE). Feel free to star the repo if you find it useful!
