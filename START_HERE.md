# Product Plate Kickstart Prompt

Copy the prompt below into your AI coding agent after cloning Product Plate. Run it from the repository root before your first real product commit.

The goal is not to polish the template. The goal is to turn the template into your product.

```text
You are customizing this Product Plate clone into a real product. Work in the current repo. Do not do a generic cleanup. Interview me, recommend what to keep/remove, then implement the chosen setup.

Core rule:
Product Plate is a selection-based starter. Pick one active product shape and one active stack path. Remove or ignore the rest. Do not build runtime provider switchers unless I explicitly need multiple providers at runtime.

Operating rules:
- Follow AGENTS.md first.
- Use bun for every package command.
- Do not commit unless I explicitly ask.
- Before Svelte edits, read docs/svelte/overview.md.
- Before Convex edits, read docs/convex.md and src/convex/_generated/ai/guidelines.md.
- Use TDD for testable behavior changes: add/update a focused test first, implement, then run the relevant command.
- Ask at most 3 short questions at a time.
- Be opinionated. Recommend what to keep and remove instead of listing every possible option.
- Treat /auth/demo as temporary public-preview material. Delete src/routes/auth/demo, src/lib/demo-account.ts, and every demo-account CTA once the real product path exists, unless I explicitly ask to keep a hosted demo.
- Treat _template_options/ as inactive source material. Do not import from it in production code.

Phase 1 - product basics only:
Ask exactly these first, then wait:
1. What is the product name?
2. What does it do, and who is it for?
3. What should be true for the first launch version?
4. What visual style, colors, and fonts do you want? (e.g. Claude theme, Zen theme, a standard shadcn palette like Slate/Stone, or custom colors/fonts? See docs/themes.md for preset details.)

Phase 2 - inspect the starter:
Inspect these files and folders before recommending changes:
- README.md
- PRODUCT.md
- AGENTS.md
- package.json
- src/lib/constants.ts
- src/routes/
- src/routes/components/
- src/routes/(app)/
- src/lib/components/
- src/lib/components/landing/
- src/lib/components/mist/
- src/convex/
- .env.example
- .env.server.example
- _template_options/
- docs/template-options.md

Then summarize the starter surfaces in four compact groups:
- Keep as-is
- Keep but rename/restyle
- Remove now
- Decide later

For each recommendation, explain why in one sentence.

Phase 3 - choose the product shape:
Offer a recommended default first. Only ask about choices that matter for this product.

Data/backend:
- Convex, recommended when realtime data, serverless functions, file storage, and fast iteration matter.
- Drizzle with PostgreSQL, recommended when SQL ownership, joins, reporting, or existing DB infrastructure matter.
- Drizzle with SQLite/Turso/D1, recommended for small apps or edge-heavy deployments.
- Custom backend, only when I already have a backend to integrate.

Auth:
- Better Auth, recommended default.
- Better Auth with OAuth only.
- Email/password only.
- No accounts yet, only for static demos, waitlists, or pre-auth prototypes.

Billing:
- Autumn, recommended default when Stripe-backed billing with less custom billing code is enough.
- Stripe direct, recommended when I need full Stripe control, custom webhooks, Connect, or advanced subscription behavior.
- Polar, recommended when checkout, benefits, and merchant-of-record style workflows fit better.
- Creem, recommended when license keys, signed webhooks, and software-sales workflows matter.
- None/waitlist, recommended if the first launch does not charge.

AI:
- Keep the AI SDK chat route and assistant UI.
- Keep only the backend chat/API pattern.
- Remove AI until the product needs it.

Product UI:
- Keep dashboard/settings/profile/admin as a base.
- Keep only landing plus auth.
- Replace the app shell with a product-specific first screen.
- Keep component-gallery pages only if useful as source examples; otherwise remove from the user-facing app.

Marketing site:
- Rename and rewrite the landing page for the real product.
- Remove Product Plate-specific claims from public copy.
- Keep only the sections that sell the actual product.

Visual style / identity:
- Claude theme (warm sand background, Outfit/Geist Mono fonts, oklch colors).
- Zen inspired theme (minimal earthy tones, Inter/Playfair Display/JetBrains Mono fonts, hsl colors).
- Standard shadcn-svelte presets (Neutral, Stone, Zinc, Gray, Slate).
- Custom variables (configure custom background, foreground, primary, fonts, border radius, and shadows).

Deployment:
- Keep Cloudflare Pages unless I name another target.
- Keep Convex hosting for backend functions and data when Convex remains active.

Phase 4 - implement after confirmation:
Identity and copy:
- Update src/lib/constants.ts.
- Update package.json name and version only if appropriate.
- Update README.md to describe the new product, not Product Plate.
- Update PRODUCT.md with the real product, users, brand voice, and design principles.
- Update AGENTS.md so future agents know the selected stack, active provider, backend path, and removed template surfaces.
- Update page titles, metadata, sitemap/robots if needed, PWA manifest values, landing copy, CTA hrefs, and visible Product Plate mentions.
- Search for old template names/URLs with rg: Product Plate, productplate, productplate.pages.dev, Demo Workspace, Product Plate Demo.

Visual style & Theme activation:
- Set up theme CSS variables, font families, radius, and shadows in src/app.css.
- If using Google fonts or external fonts, add font import declarations at the top of src/app.css or head links in src/app.html.
- Update standard layout styles or headings to reference the configured serif/sans font families.
- Refer to docs/themes.md for instructions and code blocks for Claude, Zen, and shadcn-svelte default themes.

Demo account:
- Delete src/routes/auth/demo and src/lib/demo-account.ts unless I explicitly keep a public demo.
- Remove /auth/demo from README, landing CTAs, tests, navigation, and docs.
- If keeping a demo account, make it product-specific, disposable, safe, and outside paid/private workflows.
- Do not create a separate public /demo page unless I explicitly ask.

Provider activation:
- Use _template_options as inactive source material only.
- Copy the selected payment or database scaffold into the real app location, then rename .example files to real extensions.
- Do not import from _template_options in active app code.
- Delete unselected _template_options folders after the chosen stack is active.
- If selecting Autumn, keep the current src/convex/autumn.ts, src/convex/billing.ts, and docs/autumn.md path unless the product needs a different billing model.
- If selecting Stripe direct, add Stripe env vars, create server-only checkout/webhook routes, and remove Autumn packages/component wiring if no longer used.
- If selecting Polar, keep access tokens server-side, create checkout sessions server-side, and document portal/benefit access.
- If selecting Creem, keep API keys server-side, create checkout sessions server-side, and verify signed webhooks before mutating access.
- If selecting Drizzle, add the correct driver with bun, create src/lib/server/db, add migrations, update auth adapter plans, and remove Convex app code only after replacements work.

Route cleanup:
- Keep src/routes/(app)/ only when the product needs authenticated app routes.
- Remove showcase routes such as editor, flow/graph, 3D, assistant, billing, or admin when they are not part of the product.
- Remove the components gallery route (`src/routes/components/`) if not needed as a reference in production.
- Remove matching tests when routes are removed, then add product-specific smoke tests.
- Keep src/lib/components/ui as reusable primitives.
- Keep src/lib/components/landing only if the product needs landing sections.
- Keep src/lib/components/mist only if the Product Plate marketing sections are still useful; otherwise delete or replace them.

Documentation and handoff:
- Add a short "Chosen stack" section to README.md and AGENTS.md.
- Document required local and production env vars.
- Document what was removed from the starter.
- Provide the next 3 setup commands for the selected stack.
- Leave TODOs only for real product decisions, not generic template cleanup.

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
- Give the next steps for local env, provider dashboard setup, and deployment.
```

## Current Template Defaults

- Frontend: SvelteKit, Svelte 5, Tailwind CSS v4, shadcn-svelte.
- Backend: Convex in `src/convex`.
- Auth: Better Auth.
- Billing: Autumn backed by Stripe.
- AI: Vercel AI SDK chat route and assistant UI.
- Package manager: bun.
- Deployment: Cloudflare Pages plus Convex.
- Public preview: `/auth/demo` creates a fresh disposable demo account and should usually be deleted during kickstart.
- Inactive options: `_template_options` contains scaffold material for alternate billing and database choices.

## Folder Map for Agents

```text
src/routes/                 SvelteKit routes and API handlers
src/routes/components/      Showcase component gallery routes
src/routes/(app)/           Authenticated app routes and app shell
src/routes/auth/            Auth screens and public demo entrypoint
src/lib/constants.ts        App identity, SEO, PWA, and shared metadata defaults
src/lib/components/ui/      shadcn-svelte primitives
src/lib/components/ai/      AI assistant components
src/lib/components/landing/ Reusable landing sections
src/lib/components/mist/    Product Plate marketing sections
src/convex/                 Convex schema, auth, billing, functions
_template_options/          Inactive provider/database scaffolds
docs/                       Integration docs
```
