# Product Plate Kickstart Prompt

Copy this file into your AI coding agent after cloning Product Plate. The agent should run it from the repository root before the first real product commit.

```text
You are customizing this Product Plate clone into a real product. Work in the current repo. Do not make a generic fork cleanup. Interview me, recommend what to keep and remove, then implement the chosen setup.

Operating rules:
- Follow AGENTS.md first.
- Use bun for every package command.
- Do not commit unless I explicitly ask.
- Before Svelte or Convex edits, read docs/svelte/overview.md and docs/convex.md. Before Convex edits, also read src/convex/_generated/ai/guidelines.md.
- Use TDD for behavior changes: add or update a focused test first, implement, then run the relevant command.
- Ask at most 3 short questions at a time.
- Do not build a runtime provider switcher unless I explicitly need multiple providers at runtime. Product Plate is a selection-based template: choose one active stack, copy or adapt the selected scaffold, remove the rest.
- Treat the `/auth/demo` demo-account entrypoint as temporary launch preview material. Delete `src/routes/auth/demo`, `src/lib/demo-account.ts`, and every demo-account CTA once the real product auth/onboarding path exists, unless I explicitly ask to keep a hosted demo account.

Phase 1 - ask only the product basics first:
1. What is the product name?
2. What does it do, and who is it for?
3. What should be true for the first launch version?

Wait for my answer. Do not edit yet.

Phase 2 - inspect and recommend:
1. Inspect README.md, PRODUCT.md, AGENTS.md, package.json, src/lib/constants.ts, src/routes, src/convex, .env.example, .env.server.example, and _template_options.
2. Summarize the current starter surfaces in compact bullets:
   - Keep as-is
   - Keep but rename/restyle
   - Remove now
   - Decide later
3. Recommend a starting product scope. Be opinionated and explain why in 1 sentence per recommendation.
4. Ask for confirmation or corrections before editing.

Phase 3 - choose the stack:
Ask me to choose only the decisions that matter for my product. Offer a recommended default first.

Data/backend:
- Convex, recommended when realtime, serverless functions, file storage, and fast iteration matter.
- Drizzle with PostgreSQL, recommended when SQL ownership, joins, reporting, or existing DB infrastructure matter.
- Drizzle with SQLite, Turso, D1, or another custom SQL target, recommended for small apps or edge-heavy deployments.
- Custom backend, only when I already have a backend to integrate.

Auth:
- Better Auth, recommended default.
- Better Auth with OAuth only.
- Email/password only.
- No accounts yet, recommended only for waitlists, static demos, or pre-auth prototypes.

Billing:
- Autumn, recommended default when I want Stripe-backed billing with less custom billing code and Convex integration.
- Stripe direct, recommended when I need full Stripe control, custom webhooks, Connect, or advanced subscription behavior.
- Polar, recommended when I want merchant-of-record style product checkout and entitlements.
- Creem, recommended when I want software-focused checkout, MoR-style operations, license keys, or global sales workflows.
- None/waitlist, recommended if the first launch does not charge.

AI:
- Keep AI SDK chat route and assistant UI.
- Keep the backend route but remove the demo UI.
- Remove AI until the product needs it.

Product UI:
- Keep dashboard/settings/profile/admin as a base.
- Keep only landing plus auth.
- Replace the app shell with a product-specific first screen.

Deployment:
- Keep Cloudflare Pages.
- Switch adapter only if the user names a deployment target.

Phase 4 - implement after confirmation:
Identity and copy:
- Update src/lib/constants.ts.
- Update package.json name if appropriate.
- Update README.md quickstart, feature list, env notes, and live links.
- Update PRODUCT.md to describe the new product, users, brand voice, and design principles.
- Update AGENTS.md so future agents see the actual stack, active provider, backend path, and removed template surfaces.
- Update page titles, metadata, PWA manifest values, landing copy, CTA hrefs, and visible "Product Plate" mentions.
- Search with rg for old names and template URLs: Product Plate, productplate, productplate.pages.dev, Riley Chen, Northstar Labs.

Demo account:
- Delete `src/routes/auth/demo` and `src/lib/demo-account.ts` after replacing the template preview with the real product path.
- Remove `/auth/demo` from README, landing CTAs, tests, and navigation.
- If I explicitly keep a demo account, make it product-specific, seed only safe demo data, and keep credentials out of paid/private workflows.
- Do not create a public `/demo` page unless I explicitly ask for a separate unauthenticated preview.

Provider activation:
- Use _template_options as inactive source material only.
- Copy the selected payment or database scaffold into the real app location, then rename .example files to real extensions.
- Do not import from _template_options in production code.
- Delete unselected _template_options folders after the chosen stack is active.
- If selecting Autumn, keep the current src/convex/autumn.ts, src/convex/billing.ts, and docs/autumn.md path unless the product needs a different billing model.
- If selecting Stripe direct, add stripe-related env vars, create server-only checkout and webhook routes, remove Autumn packages and Convex component wiring if no longer used.
- If selecting Polar, keep organization access tokens server-side, create checkout sessions server-side, and wire customer portal access through a server route.
- If selecting Creem, keep API keys server-side, create checkout sessions server-side, and verify signed webhooks before mutating access state.
- If selecting Drizzle, add the correct driver with bun, create src/lib/server/db, add migrations, update auth adapter plans, and remove Convex app code only after all replacements are working.

Documentation and handoff:
- Add a short "Chosen stack" section to README.md and AGENTS.md.
- Document required local and production env vars.
- Document what was removed from the starter.
- Provide the next 3 setup commands for the chosen stack.

Verification:
- Run the smallest relevant tests first.
- Run bun run check.
- Run bun run test:unit when source logic changed.
- Run bun run test:e2e when routes, auth, onboarding, billing, or public pages changed.
- Run bun run build before final handoff.
- If a command fails because an external service key is missing, document the exact missing key and leave the code in a locally verifiable state.

Final response:
- Summarize changed files.
- List the selected stack.
- List removed template surfaces.
- List verification commands and results.
- Give clear next steps for local env, provider dashboard setup, and deployment.
```

## Current Template Defaults

- Frontend: SvelteKit, Svelte 5, Tailwind CSS v4, shadcn-svelte.
- Backend: Convex in `src/convex`.
- Auth: Better Auth.
- Billing: Autumn backed by Stripe.
- Package manager: bun.
- Public preview: `/auth/demo` signs into a disposable demo account and should usually be deleted during kickstart.
- Inactive options: `_template_options` contains scaffold material for alternate billing and database choices.
