# Example: shadcn-svelte Form wrapper with Superforms

This pattern uses shadcn-svelte's generated form components. Inspect the local generated files under `$lib/components/ui/form` because APIs can vary across versions.

## `schema.ts`

```ts
import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(2).max(50)
});

export type FormSchema = typeof formSchema;
```

## `+page.server.ts`

```ts
import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms";
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
    if (!form.valid) return fail(400, { form });
    return message(form, { type: "success", text: "Saved." });
  }
};
```

## `settings-form.svelte`

```svelte
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { formSchema, type FormSchema } from "./schema";

  let {
    data
  }: {
    data: { form: SuperValidated<Infer<FormSchema>> };
  } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(formSchema)
  });

  const { form: formData, enhance, message, submitting } = form;
</script>

<form method="POST" use:enhance class="space-y-6">
  {#if $message}
    <p role="status">{$message.text}</p>
  {/if}

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

  <Form.Button disabled={$submitting}>{$submitting ? "Saving..." : "Save"}</Form.Button>
</form>
```
