# Formsnap Review Checklist

## Structure

- [ ] Every scalar field uses `Field`.
- [ ] Every radio or checkbox group uses `Fieldset` + `Legend`.
- [ ] Every dynamic array item that needs its own error uses `ElementField`.
- [ ] `FieldErrors` is placed in the matching `Field`, `Fieldset`, or `ElementField` context.

## Control wiring

- [ ] Every `Control` has a `children` snippet when an input/control is rendered inside it.
- [ ] The `props` object from `Control` is spread onto the real input/focusable control.
- [ ] Custom components forward `props` to the actual underlying control.
- [ ] Label click focuses or toggles the associated control.

## Binding

- [ ] Text inputs and textareas use `bind:value`.
- [ ] Boolean checkboxes use `bind:checked`.
- [ ] Radio groups and checkbox groups use `bind:group`.
- [ ] Dynamic array fields bind to the correct index.
- [ ] Custom selects/switches update the Superforms `$form` store.

## Accessibility

- [ ] Every field has a visible label or intentional screen-reader-only label.
- [ ] Groups have a `Legend`, not just repeated labels.
- [ ] Descriptions are used when expected input is not obvious.
- [ ] Errors are rendered close to the control and linked by Formsnap.
- [ ] No placeholder-only labels.
- [ ] Keyboard interaction works for custom controls.

## Version/syntax

- [ ] Svelte 5 code uses snippets instead of old slot props.
- [ ] Old `let:attrs` has been replaced with `{#snippet children({ props })}`.
- [ ] Old `asChild` has been replaced with a `child` snippet where applicable.
- [ ] Old `bind:el` has been replaced with `bind:ref` where applicable.
- [ ] `getFormControl`/`getFormField` have been replaced with `useFormControl`/`useFormField` when using Formsnap v2.
