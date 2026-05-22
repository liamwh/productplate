# Superforms Advanced Patterns

## Multiple forms with the same schema

Use explicit IDs.

```ts
const inviteForm = await superValidate(zod4(emailSchema), { id: "invite" });
const waitlistForm = await superValidate(zod4(emailSchema), { id: "waitlist" });

return { inviteForm, waitlistForm };
```

```svelte
<script lang="ts">
  const invite = superForm(data.inviteForm);
  const waitlist = superForm(data.waitlistForm);
</script>

<form method="POST" action="?/invite" use:invite.enhance>
  <input name="email" bind:value={$invite.form.email} />
  <button>Send invite</button>
</form>

<form method="POST" action="?/waitlist" use:waitlist.enhance>
  <input name="email" bind:value={$waitlist.form.email} />
  <button>Add to waitlist</button>
</form>
```

## Nested JSON form

Use for complex objects and arrays.

```ts
const form = superForm(data.form, {
  dataType: "json",
  validators: zod4Client(projectSchema)
});
```

```svelte
<input bind:value={$form.project.name} />
<input bind:value={$form.project.settings.slug} />

{#each $form.members as member, i}
  <input bind:value={$form.members[i].email} />
{/each}
```

Remember: with `dataType: "json"`, the `$form` store is submitted. Disabled fields still submit if their values remain in `$form`.

## File upload

```svelte
<script lang="ts">
  import { fileProxy, superForm } from "sveltekit-superforms";

  const sf = superForm(data.form, { validators: zod4Client(uploadSchema) });
  const { form, errors, enhance } = sf;
  const avatar = fileProxy(form, "avatar");
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
  <input name="avatar" type="file" accept="image/png,image/jpeg" bind:files={$avatar} />
  {#if $errors.avatar}<p>{$errors.avatar}</p>{/if}
  <button>Upload</button>
</form>
```

Server schema:

```ts
const uploadSchema = z.object({
  avatar: z
    .instanceof(File, { message: "Choose an avatar." })
    .refine((file) => file.size <= 1_000_000, "Max avatar size is 1 MB.")
});
```

## API/SPA submit

```ts
const sf = superForm(data.form, {
  SPA: true,
  validators: zod4Client(schema),
  async onUpdate({ form }) {
    if (!form.valid) return;

    const response = await fetch("/api/thing", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form.data)
    });

    if (!response.ok) {
      // Convert API errors into form errors/message.
    }
  }
});
```

## Wizard / multi-step form

- Use one final schema for the actual action.
- Use step schemas for client-side validation if needed.
- Keep the whole data model in `$form`.
- Do not trust skipped client steps; server action validates full final schema.

```ts
const sf = superForm(data.form, {
  dataType: "json",
  validators: zod4(stepOneSchema)
});

function goToFinalStep() {
  sf.options.validators = zod4(fullSchema);
}
```

## Domain-specific field errors

```ts
if (await slugExists(form.data.slug)) {
  return setError(form, "slug", "This slug is already taken.");
}
```

Use `setError` after schema validation for database/business checks.
