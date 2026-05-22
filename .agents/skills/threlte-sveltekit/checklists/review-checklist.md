# Threlte review checklist

## Correctness

- [ ] `<Canvas>` is inside a container with explicit height.
- [ ] Browser-only code is not executed during SSR.
- [ ] Threlte hooks are only used under `<Canvas>`.
- [ ] Provider-specific hooks/components are under the required provider.
- [ ] Custom camera is actually made default.
- [ ] Lit materials have lights/environment.
- [ ] Geometry/material attachment is correct.
- [ ] GLTF paths resolve from `static/` or a known URL.
- [ ] Asset-loading has fallback/error handling.
- [ ] Pointer interactivity is configured before relying on pointer events.
- [ ] Physics bodies have colliders.
- [ ] Production build does not include debug visuals unless intentional.

## Maintainability

- [ ] Route page is thin.
- [ ] Scene is split into components.
- [ ] App state and raw Three.js object refs are not mixed unnecessarily.
- [ ] Reusable scene constants live in TS modules.
- [ ] Component props represent product concepts, not only low-level coordinates.
- [ ] Magic model scale/rotation fixes are documented.
- [ ] Theatre-controlled props are not also controlled by task-loop code.

## Performance

- [ ] Render mode matches scene needs.
- [ ] No avoidable allocations in `useTask`.
- [ ] No per-frame DOM/Svelte state spam.
- [ ] Repeated meshes use instancing or reuse where appropriate.
- [ ] Textures are compressed/sized appropriately.
- [ ] Shadows are constrained.
- [ ] Raycast targets are simple.
- [ ] Heavy assets are lazy-loaded or preloaded intentionally.
- [ ] Low-end device behavior was considered.

## UX/accessibility

- [ ] Important controls are accessible DOM controls.
- [ ] Canvas does not trap focus unexpectedly.
- [ ] There is a reset view/camera option when needed.
- [ ] Loading state is visible.
- [ ] Reduced motion is respected for intense animations.
- [ ] Non-visual explanation exists where the 3D view conveys important information.
