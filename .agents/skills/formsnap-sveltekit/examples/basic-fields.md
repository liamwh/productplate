# Example: Formsnap basic field types

Assumes:

```ts
const schema = z.object({
  email: z.string().email(),
  bio: z.string().optional().default(""),
  marketingEmails: z.boolean().default(false),
  theme: z.enum(["light", "dark"]).default("light")
});
```

## Text/email field

```svelte
<Field {form} name="email">
  <Control>
    {#snippet children({ props })}
      <Label>Email</Label>
      <input {...props} type="email" bind:value={$formData.email} />
    {/snippet}
  </Control>
  <Description>Use your primary account email.</Description>
  <FieldErrors />
</Field>
```

## Textarea

```svelte
<Field {form} name="bio">
  <Control>
    {#snippet children({ props })}
      <Label>Bio</Label>
      <textarea {...props} bind:value={$formData.bio} />
    {/snippet}
  </Control>
  <Description>Short public description.</Description>
  <FieldErrors />
</Field>
```

## Boolean checkbox

```svelte
<Field {form} name="marketingEmails">
  <Control>
    {#snippet children({ props })}
      <input {...props} type="checkbox" bind:checked={$formData.marketingEmails} />
      <Label>Receive marketing emails</Label>
    {/snippet}
  </Control>
  <Description>You can unsubscribe at any time.</Description>
  <FieldErrors />
</Field>
```

## Radio group

```svelte
<Fieldset {form} name="theme">
  <Legend>Theme</Legend>
  {#each ["light", "dark"] as theme}
    <Control>
      {#snippet children({ props })}
        <input {...props} type="radio" value={theme} bind:group={$formData.theme} />
        <Label>{theme}</Label>
      {/snippet}
    </Control>
  {/each}
  <Description>Choose your preferred interface theme.</Description>
  <FieldErrors />
</Fieldset>
```
