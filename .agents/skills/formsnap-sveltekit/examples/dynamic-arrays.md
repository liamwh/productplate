# Example: Formsnap dynamic array fields

## Schema

```ts
import { z } from "zod";

export const linksSchema = z.object({
  urls: z
    .array(z.string().url("Enter a valid URL."))
    .min(1, "Add at least one URL.")
    .default([""])
});
```

## Component

```svelte
<script lang="ts">
  import {
    Control,
    Description,
    ElementField,
    FieldErrors,
    Fieldset,
    Label,
    Legend
  } from "formsnap";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { linksSchema } from "./schema";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zod4Client(linksSchema)
  });

  const { form: formData, enhance } = form;

  function addUrl() {
    $formData.urls = [...$formData.urls, ""];
  }

  function removeUrl(index: number) {
    $formData.urls = $formData.urls.filter((_, i) => i !== index);
  }
</script>

<form method="POST" use:enhance>
  <Fieldset {form} name="urls">
    <Legend>Public links</Legend>

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

    <Description>Add links that should appear on your profile.</Description>
    <FieldErrors />

    <button type="button" onclick={addUrl}>Add URL</button>
  </Fieldset>

  <button>Save</button>
</form>
```

Why this structure:

- The parent `Fieldset` represents the whole `urls` array.
- Each `ElementField` represents `urls[i]` and gets its own item-level errors.
- The final `FieldErrors` inside the `Fieldset` renders array-level errors such as minimum length.
