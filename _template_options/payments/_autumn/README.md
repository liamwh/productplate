# Autumn Billing Option

Autumn is the active default in Product Plate. Keep this option when you want Stripe-backed billing with less custom subscription code and Convex integration.

Keep:

- `src/convex/autumn.ts`
- `src/convex/billing.ts`
- `src/convex/convex.config.ts`
- `src/routes/(app)/billing`
- `docs/autumn.md`
- `AUTUMN_SECRET_KEY` in local and production Convex env

Remove:

- `_template_options/payments/_stripe`
- `_template_options/payments/_polar`
- `_template_options/payments/_creem`
- Alternate billing env vars from `.env.example` once the stack is chosen

Kickstart tasks:

1. Rename product IDs and plan names in the Autumn config and billing UI.
2. Ensure `SITE_URL` is set in Convex env for checkout redirects.
3. Replace Product Plate pricing copy with the real product offer.
4. Add product-specific entitlement checks before paid features.
