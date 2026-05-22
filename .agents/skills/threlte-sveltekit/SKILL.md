---
name: threlte-sveltekit
description: Build, debug, and review SvelteKit 3D experiences using Threlte, Three.js, @threlte/extras, @threlte/gltf, @threlte/rapier, @threlte/theatre, and related packages. Use this when the user asks for Svelte/SvelteKit 3D scenes, model viewers, configurators, physics, game-like scenes, scroll-driven 3D, performance fixes, Threlte code review, or migration from imperative Three.js.
---

# Threlte + SvelteKit Agent Skill

## Mission

Produce production-quality SvelteKit 3D code using Threlte’s declarative Svelte API while preserving the mental model of Three.js. The agent should know when to use raw Three.js concepts, when to use Threlte’s `<Canvas>` and `<T>` primitives, when to use `@threlte/extras`, when to bring in `@threlte/gltf`, when to use Rapier physics, and when Theatre.js is the right animation workflow.

The output should favor maintainable scene architecture, correct SvelteKit client boundaries, explicit asset-loading states, predictable render-loop behavior, and performance-aware 3D decisions.

## Library model

Threlte is not a separate 3D engine. Treat it as a Svelte-first declarative layer over Three.js with a set of companion packages:

- `three`: underlying rendering engine and object model.
- `@threlte/core`: core Svelte integration: `<Canvas>`, `<T>`, context hooks, render-loop/task utilities.
- `@threlte/extras`: higher-level components and plugins, such as cameras/controls/interactivity helpers and common scene utilities.
- `@threlte/gltf`: converts GLTF/GLB files into typed Svelte components and simplifies model usage.
- `@threlte/rapier`: Rapier physics integration.
- `@threlte/theatre`: Theatre.js integration for timeline/keyframe animation.
- Other ecosystem packages may exist; only introduce them when directly useful.

## First response decision tree

When a user asks for Threlte help, decide which mode you are in:

1. **New scene/app**
   - Ask only for missing product-level requirements if they affect the result.
   - Otherwise pick sensible defaults: SvelteKit route, `<Canvas>` in page component, scene contents in a child component, on-demand rendering unless animation/physics requires continuous updates.
2. **Code review/debug**
   - Look for client-only mistakes, missing canvas parent sizing, context hook usage outside `<Canvas>`, incorrect `<T>` args, bad mutation patterns, asset-loading race conditions, render-loop misuse, and performance issues.
3. **Porting Three.js to Threlte**
   - Map imperative objects to `<T.*>` components.
   - Preserve Three.js object semantics: constructor args become `args`, properties become auto props, nested object paths can use pierced props, and explicit references are used only when lifecycle or external APIs require them.
4. **Model viewer/configurator**
   - Use `useGltf` or generated `@threlte/gltf` components.
   - Include loading/fallback behavior.
   - Use presentation controls/camera controls when appropriate.
   - Provide material/variant/state architecture.
5. **Game/simulation**
   - Separate world state from rendering state.
   - Use `useTask` only for actual per-frame logic.
   - Use Rapier only when physical interactions are needed; do not force physics for simple movement.
6. **Animation-heavy scene**
   - For simple reactive movement: Svelte state + transitions/tweens + `useTask` if needed.
   - For timeline/camera/product animation: consider `@threlte/theatre`.

## SvelteKit and SSR rules

Three.js/WebGL requires browser APIs. In SvelteKit:

- Put Threlte scene code in `.svelte` components rendered on the client.
- Avoid accessing `window`, `document`, WebGL renderer internals, or browser-only APIs during SSR.
- If a page errors during SSR, use a client-only wrapper pattern or SvelteKit browser checks.
- Prefer keeping the route page thin:
  - `+page.svelte` handles layout and data.
  - `Scene.svelte` lives under `<Canvas>`.
  - Subcomponents such as `Model.svelte`, `Lights.svelte`, `PhysicsWorld.svelte`, `Controls.svelte` hold scene details.

Recommended structure:

```text
src/routes/demo/+page.svelte
src/lib/threlte/Scene.svelte
src/lib/threlte/Lights.svelte
src/lib/threlte/Model.svelte
src/lib/threlte/PhysicsWorld.svelte
src/lib/threlte/materials.ts
src/lib/threlte/assets.ts
static/models/example.glb
```

A good SvelteKit page is usually:

```svelte
<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from '$lib/threlte/Scene.svelte'
</script>

<div class="scene-frame">
  <Canvas>
    <Scene />
  </Canvas>
</div>

<style>
  .scene-frame {
    width: 100%;
    height: min(70vh, 720px);
    min-height: 420px;
  }
</style>
```

The parent of `<Canvas>` must have a real size. Many "nothing renders" bugs are just a zero-height container.

## Installation

Minimum:

```bash
npm install three @threlte/core
npm install -D @types/three
```

Common additions:

```bash
npm install @threlte/extras
npm install @threlte/gltf
npm install @threlte/rapier @dimforge/rapier3d-compat
npm install @threlte/theatre @theatre/core @theatre/studio
```

Do not install every Threlte package by default. Pick only what the feature needs.

## Core concepts

### `<Canvas>`

`<Canvas>` creates and owns the Three.js renderer, scene, default camera behavior, context, render scheduling, and event plumbing. It should be the root of the Threlte component tree.

Key practices:

- Use one `<Canvas>` per 3D viewport.
- Do not place Threlte hooks outside the Canvas subtree.
- Keep app UI overlays outside or above the Canvas with CSS when they are DOM UI.
- Use Canvas props to configure renderer behavior when needed.
- Use one persistent Canvas rather than repeatedly mounting/unmounting for route-level UI state if startup cost matters.

`<Canvas>` render modes matter:

- **On-demand** is usually best for static or mostly reactive scenes. Threlte invalidates when reactive props change.
- **Always/continuous** rendering is needed for real-time animation, physics, controls damping, simulations, or game loops.
- **Manual** rendering is for advanced render-pipeline control.

When using on-demand mode, remember to invalidate manually if external imperative code mutates objects outside Threlte’s reactive awareness.

### `<T>`

`<T>` is the central declarative wrapper for Three.js classes and objects.

Use dot notation for common Three.js exports:

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
</script>

<T.Mesh position.y={1}>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>
```

Important rules:

- Constructor parameters go into `args`.
- If `args` changes, Threlte may need to reconstruct the object. Avoid changing constructor args every frame.
- Normal object properties become component props.
- Nested object values can often be assigned through pierced props such as `position.y`, `rotation.x`, `material.color`, depending on the object structure.
- Use constant prop types. Do not switch a prop from array to object to scalar over the component’s lifetime.
- Child objects usually attach automatically when there is an obvious default attachment; otherwise use `attach`.
- For unusual Three.js classes, use `<T is={SomeClass}>`.
- Use `bind:ref` or `oncreate` only when you need a Three.js object reference.

Example with explicit reference:

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
  import type { Mesh } from 'three'

  let mesh = $state<Mesh>()
</script>

<T.Mesh bind:ref={mesh}>
  <T.SphereGeometry args={[1, 32, 32]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>
```

Avoid imperative mutation unless necessary. Prefer reactive props.

### Attachments

Three.js has parent/child relationships that are not always simple scene graph children. Materials, geometries, render targets, and helper objects may need attachment.

Common examples:

```svelte
<T.Mesh>
  <T.BoxGeometry attach="geometry" args={[1, 1, 1]} />
  <T.MeshStandardMaterial attach="material" color="orange" />
</T.Mesh>
```

When debugging invisible meshes, check:

- Is a geometry attached?
- Is a material attached?
- Is the material compatible with the lights?
- Is the mesh inside the camera frustum?
- Is the scale non-zero?
- Is the object accidentally behind the camera?

### Context and hooks

Threlte hooks consume context provided by `<Canvas>`. They must run in components inside the Canvas tree.

Common hooks:

- `useThrelte()` — access renderer, scene, camera, size, invalidation, advance, and other core context.
- `useTask()` — run per-frame logic in the render loop.
- Asset hooks such as `useLoader`, `useGltf`, and `useTexture`.
- Extras hooks/plugins for interactivity, controls, or specialized behavior.
- Rapier hooks within `<World>` context.

Bad:

```svelte
<!-- +page.svelte -->
<script>
  import { useThrelte } from '@threlte/core'
  const { camera } = useThrelte() // wrong if not inside Canvas context
</script>
```

Good:

```svelte
<!-- Scene.svelte, rendered inside <Canvas> -->
<script>
  import { useThrelte } from '@threlte/core'
  const { camera } = useThrelte()
</script>
```

## Rendering and animation

### `useTask`

Use `useTask` for per-frame work:

```svelte
<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import type { Mesh } from 'three'

  let mesh = $state<Mesh>()

  useTask((delta) => {
    if (!mesh) return
    mesh.rotation.y += delta
  })
</script>

<T.Mesh bind:ref={mesh}>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial color="tomato" />
</T.Mesh>
```

Use it for:

- animation that changes every frame;
- game/simulation stepping;
- camera-follow behavior;
- per-frame shader uniform updates;
- manual physics stepping if required.

Do not use it for:

- one-time setup;
- reactive property assignment that Svelte can express declaratively;
- polling UI state;
- layout that can be computed from props.

### On-demand invalidation

On-demand rendering is a major performance win for static scenes. Threlte invalidates for many declarative changes, but not all external mutations are observable.

If you mutate a Three.js object imperatively, call `invalidate()`:

```svelte
<script lang="ts">
  import { useThrelte } from '@threlte/core'

  const { invalidate } = useThrelte()

  function externalMutation() {
    // mutate a raw Three.js object here
    invalidate()
  }
</script>
```

### Controls and continuous rendering

Camera controls with damping may need continuous invalidation while they are moving. Prefer the control component’s built-in behavior where available. If implementing custom controls, make sure motion invalidates frames.

## Asset loading

### `useLoader`

Use `useLoader` for loader-based assets. It returns an async store-like value and caches assets.

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
  import { useLoader } from '@threlte/core'
  import { TextureLoader } from 'three'

  const texture = useLoader(TextureLoader).load('/textures/checker.png')
</script>

{#await $texture}
  <!-- optional placeholder -->
{:then map}
  <T.Mesh>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial {map} />
  </T.Mesh>
{/await}
```

### GLTF/GLB

For one-off loading:

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
  import { useGltf } from '@threlte/extras'

  const gltf = useGltf('/models/product.glb')
</script>

{#await $gltf}
  <T.Mesh>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshBasicMaterial color="gray" wireframe />
  </T.Mesh>
{:then asset}
  <T is={asset.scene} />
{/await}
```

For production model components, prefer generation with `@threlte/gltf` so the model becomes a Svelte component with named nodes/materials and better TypeScript ergonomics.

General GLTF rules:

- Put public assets in `static/`.
- Use compressed `.glb` where possible.
- Know which compression the asset uses:
  - DRACO needs DRACO decoder setup.
  - KTX2 textures need KTX2 setup.
  - Meshopt compression needs Meshopt setup.
- Avoid loading huge models directly into the first route paint without a fallback.
- Dispose or unmount assets intentionally when changing scenes.
- Do not clone and mutate shared cached assets accidentally. Clone when instances need independent transforms/materials/skeletons.
- Normalize scale/units in Blender or asset pipeline rather than fixing every model with magic scale factors.
- If a model renders black, check lights, material type, color management, environment maps, normals, and camera.

### Loading UI

3D routes should usually have a DOM overlay or placeholder. For example:

```svelte
<div class="scene-frame">
  <Canvas>
    <Scene />
  </Canvas>
  {#if loading}
    <div class="loading">Loading model…</div>
  {/if}
</div>
```

Keep the loading UI outside the WebGL scene unless it is part of the 3D world.

## Lighting and materials

Start simple:

```svelte
<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[3, 5, 4]} intensity={1.5} />
```

Use material/lights compatibility correctly:

- `MeshBasicMaterial` ignores lights.
- `MeshStandardMaterial` and `MeshPhysicalMaterial` need lights/environment.
- Tone mapping/color management can change appearance.
- Large scenes often need environment maps for convincing PBR assets.
- Debug by temporarily using `MeshBasicMaterial` or `wireframe`.

Avoid adding many real-time shadow-casting lights. Shadows are expensive. If enabling shadows:

- enable renderer shadow map;
- mark selected lights as casting shadows;
- mark only relevant meshes `castShadow` / `receiveShadow`;
- tune shadow map size and camera bounds;
- verify the visual gain is worth the cost.

## Interactivity

There are three kinds of events to distinguish:

1. DOM events on surrounding HTML.
2. Svelte component events/props.
3. Raycast-driven 3D pointer events on objects in the scene.

Use Threlte/extras interactivity when objects need pointer behavior.

Typical requirements:

- clickable meshes;
- hover states;
- drag controls;
- raycast-based selection;
- tooltips anchored to 3D objects;
- custom pointer hit areas.

Guidelines:

- Enable/configure the interactivity plugin at the root of the scene when required.
- Only make objects interactive when they need it.
- For many objects, use acceleration structures or coarse hit areas.
- Separate visual mesh from hit mesh if the visual geometry is complex.
- Avoid per-frame raycasting across the whole scene if pointer interaction is sparse.
- Stop propagation carefully when nested objects both handle pointer events.
- For UI overlays, prefer DOM controls over 3D text/buttons unless the interaction must live inside the scene.

Example style:

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
  let hovered = $state(false)
</script>

<T.Mesh
  onpointerenter={() => hovered = true}
  onpointerleave={() => hovered = false}
  onclick={() => console.log('selected')}
  scale={hovered ? 1.1 : 1}
>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial color={hovered ? 'orange' : 'white'} />
</T.Mesh>
```

If this does not work, verify that the interactivity system is installed/configured according to the version used.

## Cameras and controls

Common choices:

- Perspective camera for normal 3D scenes.
- Orthographic camera for isometric/product/diagram-like scenes.
- Orbit/presentation controls for model viewers.
- First-person/fly controls only for navigable worlds.

Rules:

- Only one camera should be the default active camera unless intentionally switching.
- If using a custom camera, set it as default/make default via the relevant Threlte API/component.
- Debug black screens by moving the camera back and pointing it at the origin.
- Do not parent the camera to animated objects unless that is intended.
- In configurators, use constrained controls to avoid users losing the object.
- Provide a reset camera button for complex viewers.

## Physics with `@threlte/rapier`

Use Rapier when object motion/collisions are physically meaningful:

- falling/stacking/rolling objects;
- character controller collision;
- rigid-body game mechanics;
- triggers/sensors;
- collision detection that would be hard to hand-code.

Do not use Rapier for:

- simple button hover;
- deterministic UI animation;
- simple path-following enemies where custom logic is clearer;
- static decorative scenes.

Core concepts:

- A `<World>` provides physics context.
- A `<RigidBody>` represents a physical body.
- Colliders define shape/contact behavior.
- A rigid body without a collider will not collide.
- Auto-colliders are convenient but can be costly or imprecise.
- Debug colliders visually during development.
- Meshes and rigid bodies have different responsibilities: render shape vs physical shape.

Example skeleton:

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
  import { World, RigidBody, Collider, Debug } from '@threlte/rapier'
</script>

<World gravity={[0, -9.81, 0]}>
  <Debug />

  <RigidBody type="fixed">
    <Collider shape="cuboid" args={[5, 0.1, 5]} />
    <T.Mesh position.y={-0.1}>
      <T.BoxGeometry args={[10, 0.2, 10]} />
      <T.MeshStandardMaterial color="#777" />
    </T.Mesh>
  </RigidBody>

  <RigidBody>
    <Collider shape="ball" args={[0.5]} />
    <T.Mesh position.y={3}>
      <T.SphereGeometry args={[0.5, 32, 32]} />
      <T.MeshStandardMaterial color="hotpink" />
    </T.Mesh>
  </RigidBody>
</World>
```

Physics review checklist:

- Is the physics world created exactly where needed?
- Are all physics components under `<World>`?
- Are dynamic objects given colliders?
- Are collider dimensions correct for Rapier’s expected args?
- Are visual and physics transforms synchronized?
- Are static bodies `fixed`?
- Are high-poly meshes avoided as trimesh colliders unless necessary?
- Is `Debug` disabled in production?
- Are collision groups/sensors used instead of manual filtering when appropriate?
- Is physics timestep deterministic enough for the product?

## Theatre.js animation

Use `@threlte/theatre` when the user needs timeline/keyframe-driven animation, art direction, camera choreography, or editable scene state.

Typical use cases:

- landing page hero sequence;
- product reveal;
- cinematic camera path;
- explainers with staged transitions;
- non-developer-adjustable transforms/materials via Theatre Studio.

Concepts:

- `<Theatre>` sets up Theatre project/sheet/studio context.
- `<SheetObject>` represents an animatable logical entity.
- `<Sync>` synchronizes Threlte object properties with Theatre sheet values.
- Theatre is a workflow choice, not mandatory for every animation.

Rules:

- Do not use Theatre for simple infinite rotation.
- Keep Theatre-controlled props separate from ordinary Svelte state where possible.
- Use clear labels for sheet objects.
- Avoid letting both `useTask` and Theatre write to the same transform.
- Keep production/studio behavior explicit.

Example skeleton:

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
  import { Theatre, SheetObject, Sync } from '@threlte/theatre'
</script>

<Theatre>
  <SheetObject key="Hero product">
    <Sync>
      <T.Mesh>
        <T.BoxGeometry args={[1, 1, 1]} />
        <T.MeshStandardMaterial color="white" />
      </T.Mesh>
    </Sync>
  </SheetObject>
</Theatre>
```

## Scene architecture patterns

### Good component boundaries

```text
Scene.svelte
  Lights.svelte
  CameraRig.svelte
  ProductModel.svelte
  Ground.svelte
  Effects.svelte
```

`Scene.svelte` should orchestrate. It should not contain every mesh, material, control, model, and physics object inline once the scene grows.

### Store app-level state outside scene

For product config:

```ts
// src/lib/stores/product-config.svelte.ts
export const productConfig = $state({
  color: 'black',
  material: 'matte',
  exploded: false
})
```

The scene reads this and maps it to visual props. Avoid storing raw Three.js objects in global app stores unless there is a strong reason.

### Model instances

If using the same GLTF many times:

- Load once, clone responsibly.
- Avoid mutating shared cached materials unless all instances should change.
- Consider instancing for many identical objects.
- Use lower-detail proxies for shadows/colliders.

## Performance rules

3D performance is dominated by GPU work, draw calls, asset size, texture memory, shaders, shadows, postprocessing, and per-frame JS. Review all of these before blaming Svelte.

### Render loop

- Prefer on-demand rendering for mostly-static scenes.
- Use continuous rendering only when needed.
- Stop tasks when components unmount.
- Avoid doing allocations in `useTask`.
- Avoid creating new vectors/materials/geometries every frame.
- Reuse `Vector3`, `Quaternion`, `Matrix4` scratch objects when writing manual per-frame code.

### Geometry and draw calls

- Merge static geometry when possible.
- Use instancing for many repeated objects.
- Simplify model geometry.
- Use LOD for large scenes.
- Avoid huge invisible objects that still render or raycast.

### Materials/textures

- Reuse materials.
- Compress textures.
- Keep texture resolution appropriate.
- Avoid too many unique materials.
- Use baked lighting when possible.
- Watch transparent materials; they are costly and ordering-sensitive.

### Shadows and postprocessing

- Shadows are expensive; enable intentionally.
- Limit shadow casters.
- Tune shadow cameras.
- Avoid stacking many postprocessing passes on low-end devices.
- Offer reduced-quality settings for heavy scenes.

### Interactivity

- Avoid raycasting against thousands of complex meshes.
- Use simple hit meshes.
- Use BVH/acceleration where needed.
- Throttle expensive hover calculations.
- Use DOM UI for forms/menus/tooltips when possible.

### Asset delivery

- Use `.glb` for packaged binary assets.
- Compress geometry/textures.
- Lazy-load heavy scene chunks.
- Preload critical assets if route interaction depends on them.
- Show a fallback and progress where possible.

## Accessibility and UX

WebGL content is not automatically accessible. For production:

- Provide text alternatives or explanatory DOM UI.
- Keep controls keyboard-accessible when the scene controls matter.
- Do not trap focus inside canvas unintentionally.
- Make DOM buttons for important actions instead of only 3D mesh clicks.
- Provide reset camera / reset view.
- Respect reduced motion where applicable.
- Avoid flashing/strobing shader effects.
- For product configurators, mirror selected state in accessible DOM.

## Common bugs and fixes

### Nothing renders

Check:

- Canvas parent has non-zero width/height.
- Component is client-rendered.
- Camera points at the object.
- Object is within camera frustum.
- Lights exist for lit materials.
- Material/geometry attached correctly.
- No CSS overlay hides the canvas.
- WebGL context is available.
- Console has asset load or shader errors.

### Hook/context error

A Threlte hook is probably used outside `<Canvas>` or outside the required provider (`<World>`, Theatre context, interactivity plugin, etc.). Move it into a child component rendered under the provider.

### GLTF loads but appears black

Likely causes:

- No lights/environment for PBR material.
- Wrong color management/tone mapping expectations.
- Missing texture paths.
- Texture compression decoder not configured.
- Normals/materials exported incorrectly.
- Object scale/camera too close causing clipping.

### Interactions do not fire

Check:

- Interactivity plugin/provider is configured.
- Target mesh has event handlers.
- Another object is intercepting raycast.
- Camera and pointer target are configured.
- Object is not invisible/non-raycastable.
- Pointer event name matches Threlte version.
- CSS overlay is not catching pointer events.

### Animation stutters

Check:

- Continuous rendering is enabled when needed.
- No allocations in `useTask`.
- No heavy reactive re-computation every frame.
- Asset/model complexity.
- Shadows/postprocessing.
- Browser devtools performance profile.
- Device pixel ratio too high.

### Physics object falls through floor

Check:

- Floor has fixed rigid body and collider.
- Dynamic object has collider.
- Collider args match shape.
- Initial object position is not already below/inside floor.
- Timestep is stable.
- Collision groups are not excluding contact.

## Code-generation standards

When generating code:

- Use TypeScript when practical.
- Use Svelte 5 syntax if the surrounding app uses it.
- Keep `<Canvas>` in a sized container.
- Separate `+page.svelte` from `Scene.svelte`.
- Include imports.
- Include minimal CSS required for sizing.
- Include loading/error fallbacks for assets.
- Do not write pseudo-code for core scene behavior unless explicitly requested.
- Prefer small complete components over giant snippets.
- Mention package installation commands if dependencies are new.
- Avoid overusing `any`; use Three.js types where useful.
- Do not invent Threlte component names. If unsure, use `<T>` with Three.js classes or say to verify the package export.

## Review rubric

A Threlte implementation is good when:

- The Canvas is correctly sized and client-safe.
- Scene logic is componentized.
- Hooks are under the right context.
- Static scenes are not continuously rendering without reason.
- Per-frame logic is small and allocation-free.
- Assets have loading states and compression awareness.
- Materials/lights/cameras are correct.
- Interactivity is not over-raycasting.
- Physics is used only when useful and has correct bodies/colliders.
- DOM UI handles accessibility-critical controls.
- Production toggles disable debug helpers.
