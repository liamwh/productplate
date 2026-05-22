---
name: superforms-sveltekit
description: Build, review, debug, and refactor SvelteKit forms using sveltekit-superforms, schema adapters, server actions, progressive enhancement, client validation, nested data, multiple forms, files, messages, and tainted-state handling.
---

# Superforms for SvelteKit — Agent Skill

## Use this skill when

Use this skill when the user asks about SvelteKit forms and any of these are involved:

- `sveltekit-superforms`, `superValidate`, `superForm`, `use:enhance`, `message`, `setError`, `SuperValidated`, `Infer`, `zod`, `zod4`, `valibot`, or schema adapters.
- Server-side validation in `+page.server.ts`, `+layout.server.ts`, or form `actions`.
- Client-side validation, real-time errors, loading/submitting state, progressive enhancement, or avoiding full page reloads.
- Forms with default values, database-backed edit forms, multiple forms on one route, nested objects/arrays, file uploads, custom submit flows, or SPA/API submissions.
- Debugging common issues such as “form data not posted”, “errors not showing”, “wrong form updated”, “body already consumed”, “file upload serialization”, or “nested array not submitting”.

Formsnap and shadcn-svelte form UI are covered in the separate `formsnap-sveltekit` skill, but Superforms still owns the data and validation layer.

## Mental model

Superforms has two halves:

1. **Server half:** `superValidate(...)` turns a schema plus optional submitted/initial data into a `SuperValidated` object containing typed data, errors, constraints, validity, id, posted state, and optional status message.
2. **Client half:** `superForm(data.form, options)` turns that `SuperValidated` object into Svelte stores and helpers such as `form`, `errors`, `constraints`, `message`, `enhance`, `submitting`, `delayed`, `timeout`, `tainted`, and utility methods.

Treat the schema as the contract. The server action remains the authority. Client validation is UX, not security.

## Preferred default stack for new code

For new SvelteKit + TypeScript code:

- Prefer Svelte 5 syntax if the project already uses it: `let { data } = $props();`, snippets, and modern component composition.
- Prefer Zod 4 if the app already uses Zod 4, with `zod4` / `zod4Client` adapters.
- If the project uses Zod 3, keep `zod` / `zodClient` and the project’s existing import style.
- If the project already uses Valibot, ArkType, Yup, TypeBox, or another supported adapter, do not migrate validation libraries unless explicitly requested.
- Keep schemas outside `load` and action functions so adapters can be cached and types remain shared.

Always inspect the project’s existing dependency versions and adapter imports before changing adapter names.

## Canonical file layout

For a route-local form:

```txt
src/routes/settings/
  schema.ts
  +page.server.ts
  +page.svelte
  settings-form.svelte    # optional component extraction
```

For reusable app forms:

```txt
src/lib/schemas/user.ts
src/lib/server/user-service.ts
src/lib/components/forms/UserSettingsForm.svelte
src/routes/settings/+page.server.ts
src/routes/settings/+page.svelte
```

Keep business logic outside `+page.server.ts` when it grows beyond simple CRUD.

## Core workflow

When asked to create or fix a form:

1. Identify the form purpose: create, edit, delete, search/filter, login, upload, wizard, settings, or inline row action.
2. Identify the schema and data shape. Decide whether plain HTML form data is enough or whether `dataType: 'json'` is needed.
3. Create or reuse a schema in a stable module scope.
4. In `load`, call `superValidate(adapter(schema))` for an empty form, or `superValidate(initialData, adapter(schema))` for edit forms.
5. Return the form object from `load`, normally as `{ form }` or a clearly named equivalent.
6. In actions, call `superValidate(event/request, adapter(schema))` before reading the body elsewhere.
7. If invalid, return `fail(400, { form })`.
8. If valid, use `form.data` only after validation. Persist or perform the side effect.
9. Return `{ form }`, `message(form, ...)`, `setError(form, ...)`, or redirect as appropriate.
10. In the component, call `superForm(data.form, options)`, bind inputs to `$form`, show `$errors`, spread `$constraints`, and add `use:enhance` when you want progressive enhancement.
11. Review accessibility: every input has a real label, error state, and description/constraints where useful.
12. Test both JavaScript-enabled and no-JavaScript behavior unless the form is explicitly SPA-only.

## Basic Zod 4 pattern

`schema.ts`

```ts
import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters.").max(50),
  email: z.string().email("Enter a valid email address."),
  marketingEmails: z.boolean().default(false)
});

export type FormSchema = typeof formSchema;
```

`+page.server.ts`

```ts
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema))
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    // Use only validated data from here down.
    const { username, email, marketingEmails } = form.data;

    // await saveUserSettings(event.locals.user.id, { username, email, marketingEmails });

    return message(form, {
      type: "success",
      text: "Settings saved."
    });
  }
};
```

`+page.svelte`

```svelte
<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { formSchema } from "./schema";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(formSchema)
  });

  const { form: formData, errors, constraints, enhance, message, submitting } = form;
</script>

<form method="POST" use:enhance novalidate>
  {#if $message}
    <p class="status" data-type={$message.type}>{$message.text}</p>
  {/if}

  <label for="username">Username</label>
  <input
    id="username"
    name="username"
    bind:value={$formData.username}
    aria-invalid={$errors.username ? "true" : undefined}
    {...$constraints.username}
  />
  {#if $errors.username}<p class="error">{$errors.username}</p>{/if}

  <label for="email">Email</label>
  <input
    id="email"
    name="email"
    type="email"
    bind:value={$formData.email}
    aria-invalid={$errors.email ? "true" : undefined}
    {...$constraints.email}
  />
  {#if $errors.email}<p class="error">{$errors.email}</p>{/if}

  <label>
    <input
      name="marketingEmails"
      type="checkbox"
      bind:checked={$formData.marketingEmails}
    />
    Receive product emails
  </label>

  <button disabled={$submitting}>
    {$submitting ? "Saving..." : "Save"}
  </button>
</form>
```

Notes:

- `novalidate` disables native browser validation UI, which is often desirable when you render your own errors. Remove it if you want browser validation as a first layer.
- Boolean checkboxes use `bind:checked`, not `bind:value`.
- Inputs still need `name` attributes for normal form posting unless using `dataType: 'json'`.

## Edit form pattern

When editing a database record, pass initial data into `superValidate`:

```ts
export const load: PageServerLoad = async ({ params, locals }) => {
  const user = await locals.db.user.findUniqueOrThrow({ id: params.id });

  return {
    form: await superValidate(
      {
        username: user.username,
        email: user.email,
        marketingEmails: user.marketingEmails
      },
      zod4(formSchema)
    )
  };
};
```

Do not pass raw database records if they contain extra fields, sensitive fields, incompatible Date/string types, or nullable values not accepted by the schema. Shape the object deliberately.

## Server actions: valid, invalid, business errors

Use schema validation for shape errors and `setError` for business/domain errors discovered after validation.

```ts
import { fail } from "@sveltejs/kit";
import { message, setError, superValidate } from "sveltekit-superforms";

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));

    if (!form.valid) return fail(400, { form });

    const emailTaken = await isEmailTaken(form.data.email);
    if (emailTaken) {
      return setError(form, "email", "That email is already in use.");
    }

    await save(form.data);
    return message(form, { type: "success", text: "Saved." });
  }
};
```

Use `message(form, errorMessage, { status: 4xx })` for form-level errors that are not tied to a field. Use `setError(form, field, ...)` for field-specific errors.

## Client-side validation

Client validation improves UX but does not replace server validation.

Use the client adapter matching the server adapter:

```ts
const form = superForm(data.form, {
  validators: zod4Client(formSchema),
  validationMethod: "auto"
});
```

Common options:

- `validationMethod: "auto"` — good default; avoids shouting errors too early.
- `validationMethod: "onblur"` — useful for traditional forms.
- `validationMethod: "oninput"` — use sparingly; can be noisy.
- `validationMethod: "onsubmit"` — closest to server-only behavior.
- `validators: "clear"` — clears a field’s previous error when it changes, without bundling the full schema library.
- `validators: false` — no client schema validation.

For multi-step forms, use partial schemas for early steps and switch to the full schema before final submission. If switching validators dynamically, use the full adapter rather than a client-only adapter where required by Superforms.

## `use:enhance`

Add `use:enhance` when you want client-side progressive enhancement:

```svelte
<form method="POST" use:enhance>
```

This enables client-side validation, event hooks, timers, automatic focus behavior, tainted-state handling, and non-full-page submissions. Without JavaScript, the form should still submit as a normal SvelteKit action unless you intentionally built SPA mode.

Do not pass SvelteKit’s regular `enhance` callback directly to `use:enhance` when using Superforms. Configure Superforms using `superForm(..., { onSubmit, onResult, onUpdate, onUpdated, onError })` or through the returned `enhance` action.

## Event hooks

Use events for integration points, not ordinary validation.

```ts
const form = superForm(data.form, {
  validators: zod4Client(formSchema),
  onSubmit({ cancel, formData }) {
    // Last chance to cancel or adjust submission.
  },
  onResult({ result, cancel }) {
    // Inspect raw ActionResult.
  },
  onUpdate({ form, cancel }) {
    // Runs before client stores update. Good for confirmation flows.
  },
  onUpdated({ form }) {
    // Runs after stores update. Good for toast side effects.
  },
  onError: "apply"
});
```

Use `onUpdate` in SPA mode to call external APIs after client validation passes.

## Multiple forms on one page

If two forms have different schema shapes and use `use:enhance`, Superforms can usually distinguish them. If multiple forms use the same schema, set explicit IDs on the server.

```ts
const profileForm = await superValidate(zod4(profileSchema), { id: "profile" });
const billingForm = await superValidate(zod4(billingSchema), { id: "billing" });
```

Return each with a clear name:

```ts
return { profileForm, billingForm };
```

Client:

```ts
const profile = superForm(data.profileForm);
const billing = superForm(data.billingForm);
```

Use named actions to avoid ambiguous submissions:

```svelte
<form method="POST" action="?/updateProfile" use:profile.enhance>
<form method="POST" action="?/updateBilling" use:billing.enhance>
```

## Nested data and arrays

Plain HTML form posting is string-based. For complex nested objects, arrays, dates, and rich structures, use:

```ts
const form = superForm(data.form, {
  dataType: "json"
});
```

Important consequences of `dataType: "json"`:

- Superforms posts the `$form` store, not the literal input `name=value` payload.
- `name` attributes are no longer required for data submission, though they can still help browser autofill.
- Disabled inputs do not prevent values in `$form` from being posted; remove or clear values from `$form` if they must not be submitted.
- Update the store as the source of truth.

Use `arrayProxy`, `formFieldProxy`, `dateProxy`, `fileProxy`, and related proxy helpers when binding UI controls to values that need conversion or field-level state.

## Proxy helpers

Use proxies when raw `bind:value` is awkward:

- `dateProxy` for `Date` schema fields rendered as `<input type="date">` strings.
- `stringProxy` when empty string should become `null` or `undefined`.
- `arrayProxy` for list-like forms with item-level errors.
- `fileProxy` / `filesProxy` for file inputs.
- `formFieldProxy` when creating reusable field components from the full `superForm` object.

Example date field:

```svelte
<script lang="ts">
  import { dateProxy, superForm } from "sveltekit-superforms";

  const { form, enhance } = superForm(data.form);
  const birthday = dateProxy(form, "birthday", {
    format: "date",
    empty: "undefined"
  });
</script>

<input name="birthday" type="date" bind:value={$birthday} />
```

## File uploads

Use file schemas, multipart encoding, and file proxies.

Server schema:

```ts
const schema = z.object({
  image: z
    .instanceof(File, { message: "Please upload an image." })
    .refine((file) => file.size <= 1_000_000, "Image must be at most 1 MB.")
    .refine((file) => ["image/png", "image/jpeg"].includes(file.type), "Use PNG or JPEG.")
});
```

Client:

```svelte
<script lang="ts">
  import { fileProxy, superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";

  const { form, enhance, errors } = superForm(data.form, {
    validators: zod4Client(schema)
  });

  const image = fileProxy(form, "image");
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
  <input name="image" type="file" accept="image/png,image/jpeg" bind:files={$image} />
  {#if $errors.image}<p>{$errors.image}</p>{/if}
  <button>Upload</button>
</form>
```

For file upload failures, follow the project’s Superforms version guidance. In Superforms v2 docs, file examples import `fail` from `sveltekit-superforms` to avoid returning unserializable file objects.

## Tainted / dirty forms

Use tainted state when accidental navigation would lose user work:

```ts
const form = superForm(data.form, {
  taintedMessage: "You have unsaved changes. Leave anyway?"
});
```

Use `isTainted()` for custom UI:

```ts
const { isTainted } = form;

if (isTainted("email")) {
  // show per-field dirty indicator
}
```

After a successful valid result, Superforms untaints the form. If you update stores programmatically and do not want to mark fields dirty, use update/set proxy options with `taint: false` or the appropriate untaint mode.

## SPA mode / external API submission

Use SPA mode when the form should not submit to SvelteKit actions, for example when calling an external API from the client:

```ts
const form = superForm(data.form, {
  SPA: true,
  validators: zod4Client(formSchema),
  async onUpdate({ form }) {
    if (!form.valid) return;

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form.data)
    });

    if (!res.ok) {
      // map API errors into the form if needed
    }
  }
});
```

Still add `use:enhance`; SPA mode depends on it.

## Debugging checklist

When a Superforms form fails, check in this order:

1. **Schema module scope:** schema and adapter inputs are not recreated inside `load` unnecessarily.
2. **Load return:** `load` returns the `SuperValidated` object expected by the component.
3. **Client initialization:** `superForm(data.form)` uses the same property returned by `load`.
4. **Action validation:** action calls `superValidate(event/request/formData, adapter(schema))`.
5. **No consumed body:** code does not call `request.formData()` before `superValidate(request/event, ...)`. If needed, pass the already-read `FormData` to `superValidate`.
6. **Input names:** every normally posted input has `name`, unless `dataType: "json"` is used.
7. **Correct binding:** text uses `bind:value`; checkbox uses `bind:checked`; checkbox group/radio uses `bind:group`; file uses `bind:files` with proxy where appropriate.
8. **Invalid return:** invalid actions return `fail(400, { form })` or equivalent; they do not throw generic errors.
9. **Same schema forms:** repeated schema instances have explicit IDs.
10. **Enhance mismatch:** form uses Superforms `enhance`, not a conflicting `$app/forms` enhance callback.
11. **Adapter mismatch:** server/client adapters match the installed validation library version.
12. **File upload:** form has `enctype="multipart/form-data"` and file objects are not returned in a way SvelteKit cannot serialize.
13. **Nested data:** if using objects/arrays/dates, either use `dataType: "json"` or correct Superforms path conventions/proxies.
14. **Accessibility:** errors are visible and inputs expose `aria-invalid` or Formsnap/shadcn wiring.
15. **No-JS fallback:** forms still work without JS unless the requirement says SPA-only.

## Common mistakes and fixes

### “The form store changes, but the server receives nothing”

Usually missing `name` attributes. Add names to inputs or use `dataType: "json"` when the store is the submission source.

### “The request body has already been consumed”

Do not read `request.formData()` and then pass `request` to `superValidate`. Either let `superValidate` read the request, or pass the already-read `FormData` object.

### “Errors show immediately on first render”

Check whether initial data was passed to `superValidate` and whether the `errors` option is enabled. Empty load forms normally avoid showing initial errors.

### “Both forms update when I submit one”

Set unique `id` values in `superValidate` for forms using the same schema. Use named actions and separate `superForm` instances.

### “Checkbox value is wrong”

Boolean checkbox: `bind:checked={$formData.enabled}`. Checkbox group: array schema plus `bind:group={$formData.items}` and a `value` per checkbox.

### “The form resets after submit but I want to keep values”

Set `resetForm: false` in `superForm` options.

### “Server returned success, but I need a toast”

Return `message(form, { type, text })` and show it from the `$message` store, or trigger toast in `onUpdated`.

## Review output format

When reviewing or generating code, report:

- The schema shape and adapter used.
- The load/action flow.
- Whether the form is plain `FormData`, `dataType: "json"`, multipart, or SPA.
- Client options: validators, enhance, reset behavior, tainted behavior.
- Accessibility/error handling state.
- Exact files to create/change.
- Any version assumptions, especially Zod 3 vs Zod 4 and Svelte 4 vs Svelte 5 syntax.

## Reference docs checked

- Superforms docs: https://superforms.rocks/
- Superforms Get Started: https://superforms.rocks/get-started/zod
- Superforms API: https://superforms.rocks/api
- Superforms client validation: https://superforms.rocks/concepts/client-validation
- Superforms error handling: https://superforms.rocks/concepts/error-handling
- Superforms events: https://superforms.rocks/concepts/events
- Superforms file uploads: https://superforms.rocks/concepts/files
- Superforms multiple forms: https://superforms.rocks/concepts/multiple-forms
- Superforms nested data: https://superforms.rocks/concepts/nested-data
- Superforms status messages: https://superforms.rocks/concepts/messages
- Superforms tainted fields: https://superforms.rocks/concepts/tainted
