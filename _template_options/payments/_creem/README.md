# Creem Billing Option

Use this when the product should sell software through Creem checkout sessions, test mode, signed webhooks, and optional license workflows.

Install only if selected:

```sh
bun add creem
```

Environment:

```env
CREEM_API_KEY=
CREEM_TEST_MODE=true
CREEM_PRODUCT_PRO=
CREEM_WEBHOOK_SECRET=
```

Activation checklist:

1. Copy `billing-adapter.ts.example` to `src/lib/server/billing/provider.ts`.
2. Keep `CREEM_API_KEY` and `CREEM_WEBHOOK_SECRET` server-side only.
3. Create checkout sessions from server routes or Convex actions, never from client components.
4. Use test mode first.
5. Verify signed webhooks before granting paid access or license state.
6. Remove Autumn or other billing providers after Creem checkout and entitlement sync work.

Official docs checked while creating this scaffold:

- Creem API introduction: https://docs.creem.io/api-reference/introduction
- Creem create Checkout Session: https://docs.creem.io/api-reference/endpoint/create-checkout
