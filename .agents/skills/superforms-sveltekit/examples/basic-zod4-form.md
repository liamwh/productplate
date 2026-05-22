# Example: Basic SvelteKit + Superforms + Zod 4 form

This is the default pattern for a typed, progressively enhanced SvelteKit form.

## `schema.ts`

```ts
import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().min(2, "Display name is too short.").max(80),
  email: z.string().email("Enter a valid email."),
  bio: z.string().max(280).optional().default("")
});

export type ProfileSchema = typeof profileSchema;
```

## `+page.server.ts`

```ts
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { profileSchema } from "./schema";

export const load: PageServerLoad = async ({ locals }) => {
  const user = await locals.db.user.findUnique({ where: { id: locals.user.id } });

  return {
    form: await superValidate(
      {
        displayName: user?.displayName ?? "",
        email: user?.email ?? "",
        bio: user?.bio ?? ""
      },
      zod4(profileSchema)
    )
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(profileSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const emailTaken = await event.locals.db.user.findFirst({
      where: {
        email: form.data.email,
        NOT: { id: event.locals.user.id }
      }
    });

    if (emailTaken) {
      return setError(form, "email", "This email is already used by another account.");
    }

    await event.locals.db.user.update({
      where: { id: event.locals.user.id },
      data: form.data
    });

    return message(form, { type: "success", text: "Profile updated." });
  }
};
```

## `+page.svelte`

```svelte
<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { profileSchema } from "./schema";

  let { data } = $props();

  const sf = superForm(data.form, {
    validators: zod4Client(profileSchema),
    resetForm: false,
    taintedMessage: "You have unsaved profile changes."
  });

  const { form, errors, constraints, enhance, message, submitting } = sf;
</script>

<form method="POST" use:enhance novalidate>
  {#if $message}
    <p role="status">{$message.text}</p>
  {/if}

  <label for="displayName">Display name</label>
  <input
    id="displayName"
    name="displayName"
    bind:value={$form.displayName}
    aria-invalid={$errors.displayName ? "true" : undefined}
    {...$constraints.displayName}
  />
  {#if $errors.displayName}<p class="error">{$errors.displayName}</p>{/if}

  <label for="email">Email</label>
  <input
    id="email"
    name="email"
    type="email"
    bind:value={$form.email}
    aria-invalid={$errors.email ? "true" : undefined}
    {...$constraints.email}
  />
  {#if $errors.email}<p class="error">{$errors.email}</p>{/if}

  <label for="bio">Bio</label>
  <textarea
    id="bio"
    name="bio"
    bind:value={$form.bio}
    aria-invalid={$errors.bio ? "true" : undefined}
    {...$constraints.bio}
  />
  {#if $errors.bio}<p class="error">{$errors.bio}</p>{/if}

  <button disabled={$submitting}>{$submitting ? "Saving..." : "Save profile"}</button>
</form>
```
