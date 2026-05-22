# Superforms Review Checklist

Use this before marking a SvelteKit Superforms implementation as done.

## Schema

- [ ] Schema is declared at module scope, not recreated inside every load/action unless necessary.
- [ ] Schema has deliberate defaults for optional fields that render as controlled inputs.
- [ ] Error messages are user-facing and specific.
- [ ] Adapter matches validation library version (`zod4` for Zod 4, existing adapter otherwise).
- [ ] Shared client/server schema does not import server-only modules.

## Server

- [ ] `load` returns a `SuperValidated` object for every client `superForm` instance.
- [ ] Edit forms pass shaped initial data, not raw database objects with extra/sensitive fields.
- [ ] Action calls `superValidate` before consuming the request body elsewhere.
- [ ] Invalid actions return `fail(400, { form })` or a Superforms-compatible equivalent.
- [ ] Valid actions use only `form.data`.
- [ ] Business errors use `setError` for fields or `message(..., { status })` for form-level errors.
- [ ] File uploads use multipart encoding and compatible fail/return behavior.

## Client

- [ ] `superForm(data.form)` points at the correct property from `load`.
- [ ] `use:enhance` is added when client validation, events, timers, or SPA mode are expected.
- [ ] All normally submitted inputs have `name` unless using `dataType: "json"`.
- [ ] `bind:value`, `bind:checked`, `bind:group`, and `bind:files` are used appropriately.
- [ ] `$errors` are rendered near their fields.
- [ ] `$constraints` are spread or Formsnap/shadcn provides equivalent attributes.
- [ ] Submit button reflects `$submitting`/loading state where useful.
- [ ] `resetForm`, `taintedMessage`, and `validationMethod` are intentionally chosen.

## Edge cases

- [ ] Multiple forms with the same schema have explicit IDs.
- [ ] Nested object/array forms use `dataType: "json"` or correct path/proxy handling.
- [ ] Disabled fields are not relied upon to omit values when using `dataType: "json"`.
- [ ] No-JS fallback works unless intentionally SPA-only.
- [ ] Error focus and `aria-invalid` behavior are present.
