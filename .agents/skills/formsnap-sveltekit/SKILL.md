---
name: formsnap-sveltekit
description: Build, review, debug, and refactor accessible SvelteKit form UI using Formsnap with sveltekit-superforms, including Field, Fieldset, Control, Label, Description, FieldErrors, ElementField, Svelte 5 snippets, shadcn-svelte form wrappers, dynamic arrays, checkbox/radio groups, and custom controls.
---

# Formsnap for SvelteKit — Agent Skill

## Use this skill when

Use this skill when the user asks about form UI in SvelteKit and any of these are involved:

- `formsnap`, `Field`, `Fieldset`, `ElementField`, `Control`, `Label`, `Legend`, `Description`, `FieldErrors`, `useFormControl`, `useFormField`, snippets, or `child` snippets.
- shadcn-svelte `Form.*` components that wrap Formsnap and Superforms.
- Accessible form field composition: labels, `for`, `id`, descriptions, error messages, `aria-invalid`, `aria-describedby`, checkbox/radio groups, custom selects, switches, or custom inputs.
- Dynamic array fields where each element needs its own label/error state.
- Migrating older Formsnap slot/`asChild`/`let:attrs` patterns to Formsnap v2 and Svelte 5 snippets.

Use the `superforms-sveltekit` skill first when the task involves schemas, validation adapters, actions, nested data, files, or submit behavior. Formsnap is the UI/accessibility layer around the Superforms instance.

## Mental model

Formsnap does not replace Superforms. It composes around the object returned by `superForm(...)` and wires field state into accessible markup.

- `Field` scopes state for one schema path.
- `Fieldset` scopes state for grouped controls such as radio groups and checkbox groups.
- `ElementField` scopes state for a single array element, e.g. `urls[{i}]`.
- `Control` associates a label with one actual control and provides spreadable control props.
- `Label` / `Legend` provide accessible names.
- `Description` provides accessible help text.
- `FieldErrors` renders validation messages and links them to the control when errors are present.

Formsnap components are mostly context providers and attribute/linking helpers. The input value still binds to the Superforms `$form` store.

## Preferred default stack for new code

- Use Svelte 5 syntax and snippets for new code.
- Use the project’s existing style system. If it uses shadcn-svelte, use `import * as Form from "$lib/components/ui/form/index.js"` and local UI inputs.
- If the project uses raw Formsnap, import components directly from `formsnap`.
- Prefer `Field` for single scalar fields, `Fieldset` for grouped choices, and `ElementField` for items inside array fields.
- Always spread `props` from `Control` onto the actual interactive element or compatible custom component.

## Canonical raw Formsnap pattern

```svelte
<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { Field, Control, Label, Description, FieldErrors } from "formsnap";
  import { formSchema } from "./schema";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(formSchema)
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Field {form} name="email">
    <Control>
      {#snippet children({ props })}
        <Label>Email</Label>
        <input {...props} type="email" bind:value={$formData.email} />
      {/snippet}
    </Control>
    <Description>Use the email address associated with your account.</Description>
    <FieldErrors />
  </Field>

  <button>Save</button>
</form>
```

The important invariant: the `props` object from `Control` must land on the real input/control. That is what connects ID, label, description, error, and ARIA wiring.

## Canonical shadcn-svelte pattern

```svelte
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { formSchema } from "./schema";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(formSchema)
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button>Save</Form.Button>
</form>
```

If a project’s shadcn-svelte version has moved away from Formsnap-backed `Form.*` components, follow the installed components in `$lib/components/ui/form` rather than forcing Formsnap imports.

## Component decision table

| Need | Use |
|---|---|
| One text/email/password/textarea/select field | `Field` + one `Control` |
| Boolean checkbox | `Field` + one `Control`, bind `checked` |
| Radio group | `Fieldset` + `Legend` + one `Control` per option |
| Checkbox group array | `Fieldset` + `Legend` + one `Control` per option, bind `group` |
| Dynamic array items | Parent `Fieldset`, inner `ElementField` for each item |
| Custom select/switch/date picker | `Field`/`Fieldset` + `Control`; forward `props` to the focusable/control element or hidden input as required |
| Reusable styled form item | Create a wrapper around `Field`, `Control`, and `FieldErrors` with generics |
| Need field state inside custom component | `useFormField()` |
| Need control props inside custom component | `useFormControl()` |

## Accessibility rules

Never produce a field without:

- A programmatic label (`Label`, `Legend`, or equivalent `aria-label` only when a visual label is impossible).
- Error rendering near the field (`FieldErrors` or equivalent).
- Description text where the expected value is not obvious.
- Proper group semantics for radio/checkbox groups (`Fieldset` + `Legend`).
- `props` from `Control` spread onto the actual control.

For visually hidden labels, use a real `Label` with an `sr-only` class instead of omitting the label.

## Checkbox and radio groups

Use `Fieldset` because a group maps to one schema field but multiple controls.

```svelte
<Fieldset {form} name="theme">
  <Legend>Theme</Legend>
  {#each themes as theme}
    <Control>
      {#snippet children({ props })}
        <input {...props} type="radio" value={theme} bind:group={$formData.theme} />
        <Label>{theme}</Label>
      {/snippet}
    </Control>
  {/each}
  <Description>Choose how the app should look.</Description>
  <FieldErrors />
</Fieldset>
```

Checkbox group:

```svelte
<Fieldset {form} name="allergies">
  <Legend>Allergies</Legend>
  {#each allergies as allergy}
    <Control>
      {#snippet children({ props })}
        <input
          {...props}
          type="checkbox"
          value={allergy}
          bind:group={$formData.allergies}
        />
        <Label>{allergy}</Label>
      {/snippet}
    </Control>
  {/each}
  <Description>Select all that apply.</Description>
  <FieldErrors />
</Fieldset>
```

Use schema refinement for impossible combinations like “None” plus other selected values.

## Dynamic array fields

Use `ElementField` for each array item so each item can have its own error state.

```svelte
<Fieldset {form} name="urls">
  <Legend>Public URLs</Legend>

  {#each $formData.urls as _, i}
    <ElementField {form} name="urls[{i}]">
      <Control>
        {#snippet children({ props })}
          <Label class="sr-only">URL {i + 1}</Label>
          <input {...props} type="url" bind:value={$formData.urls[i]} />
          <button type="button" onclick={() => removeUrl(i)}>Remove</button>
        {/snippet}
      </Control>
      <FieldErrors />
    </ElementField>
  {/each}

  <Description>These links will be shown on your public profile.</Description>
  <FieldErrors />
  <button type="button" onclick={addUrl}>Add URL</button>
</Fieldset>
```

Use one `FieldErrors` inside each `ElementField` for item-level errors, and one `FieldErrors` at `Fieldset` level for array-level errors such as `.min(2)`.

## Custom controls

When a custom component renders the input internally, either:

1. Pass `props` from `Control` down to that component and make the component spread them onto its actual input/focusable element, or
2. Use `useFormControl()` inside the custom component.

Example custom component with `useFormControl()`:

```svelte
<!-- LabelInput.svelte -->
<script lang="ts">
  import { useFormControl } from "formsnap";

  let { label, value = $bindable() }: { label: string; value: string } = $props();
  const control = useFormControl();
</script>

<label {...control.labelProps}>{label}</label>
<input {...control.props} bind:value />
```

Use it inside `Control`:

```svelte
<Field {form} name="email">
  <Control>
    <LabelInput label="Email" bind:value={$formData.email} />
  </Control>
  <FieldErrors />
</Field>
```

Do not destructure `useFormControl()` / `useFormField()` return values if the current Formsnap version documents reactive getters. Keep the returned object and access properties from it.

## Formsnap v2 / Svelte 5 migration notes

Formsnap v2 uses Svelte 5 snippet patterns.

Common migrations:

- `asChild` prop -> `child` snippet.
- `bind:el` -> `bind:ref`.
- Slot props such as `let:attrs` -> snippet props such as `{#snippet children({ props })}`.
- `getFormField()` -> `useFormField()`.
- `getFormControl()` -> `useFormControl()`.
- Store-like destructuring from composition helpers -> keep object and use reactive getter properties.

Before:

```svelte
<Control let:attrs>
  <input {...attrs} bind:value={$formData.name} />
</Control>
```

After:

```svelte
<Control>
  {#snippet children({ props })}
    <input {...props} bind:value={$formData.name} />
  {/snippet}
</Control>
```

## Formsnap + Superforms workflow

1. Create schema and Superforms server action first.
2. Initialize `const form = superForm(data.form, options)` in the Svelte component.
3. Destructure `formData` and `enhance`: `const { form: formData, enhance } = form`.
4. Wrap each field path with `Field`, `Fieldset`, or `ElementField`.
5. Inside `Control`, render `Label` and the actual input/control.
6. Spread `{...props}` from `Control` on the actual control.
7. Bind the value to `$formData.<field>`.
8. Render `Description` and `FieldErrors`.
9. Use `use:enhance` on the `<form>`.
10. Verify keyboard navigation, screen-reader naming, visible errors, and no-JS fallback.

## Common mistakes and fixes

### Label click does not focus/check the input

The `props` from `Control` probably were not spread on the real input/control, or the `Label` is outside the `Control` relationship.

### Errors are not announced or associated

Use `FieldErrors` inside the corresponding `Field`, `Fieldset`, or `ElementField`. Do not render one global error blob as the only feedback.

### Checkbox/radio group has repeated field-level errors

Use one `Fieldset` for the group and render one `FieldErrors` at group level. Only use `ElementField` for dynamic arrays where each item has separate validation.

### Custom select works visually but form value does not submit

Ensure the selected value updates `$formData.field`. If using normal form posting, also ensure the backing input has `name` or that the component integrates with Superforms/Formsnap correctly. For complex/custom controls, consider `dataType: "json"`.

### Svelte complains about old slot syntax

Convert old Formsnap examples to snippets. Current Formsnap v2 uses Svelte 5-style snippets for child/children props.

## Review output format

When reviewing Formsnap code, report:

- Which fields use `Field`, `Fieldset`, or `ElementField`.
- Whether every control receives `props` from `Control`.
- Whether value bindings update the Superforms `$form` store.
- Whether labels, descriptions, errors, groups, and ARIA wiring are present.
- Whether the code is raw Formsnap or shadcn-svelte wrapper style.
- Any Svelte 4/v1 syntax that should be migrated to Formsnap v2/Svelte 5 syntax.

## Reference docs checked

- Formsnap docs: https://formsnap.dev/docs
- Formsnap quick start: https://formsnap.dev/docs/quick-start
- Formsnap Field: https://formsnap.dev/docs/components/field
- Formsnap Control: https://formsnap.dev/docs/components/control
- Formsnap FieldErrors: https://formsnap.dev/docs/components/field-errors
- Formsnap ElementField: https://formsnap.dev/docs/components/element-field
- Formsnap useFormControl: https://formsnap.dev/docs/composition/use-form-control
- Formsnap checkbox groups: https://formsnap.dev/docs/recipes/checkbox-groups
- Formsnap dynamic fields: https://formsnap.dev/docs/recipes/dynamic-fields
- Formsnap v2 migration guide: https://formsnap.dev/docs/v2-migration-guide
- shadcn-svelte Form docs: https://www.shadcn-svelte.com/docs/components/form
