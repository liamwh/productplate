# Stripe Direct Option

Use this when the product needs direct Stripe control instead of Autumn: custom webhooks, Stripe Connect, complex subscription logic, invoices, or a team that already operates Stripe directly.

Install only if selected:

```sh
bun add stripe
```

Environment:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PUBLIC_STRIPE_PRICE_PRO=
```

Activation checklist:

1. Copy `billing-adapter.ts.example` to `src/lib/server/billing/provider.ts`.
2. Create server routes under `src/routes/api/billing/checkout` and `src/routes/api/billing/webhook`.
3. Use Stripe's official SDK for webhook signature verification.
4. Replace calls to `api.billing.checkout` and `api.billing.billingPortal`.
5. Remove Autumn packages, Convex component wiring, and docs only after the Stripe flow is verified.
6. Update README.md and AGENTS.md with the selected Stripe setup.

Official docs checked while creating this scaffold:

- Stripe Checkout Sessions API: https://docs.stripe.com/api/checkout/sessions
- Stripe create Checkout Session: https://docs.stripe.com/api/checkout/sessions/create
- Stripe webhook signatures: https://docs.stripe.com/webhooks/signature
