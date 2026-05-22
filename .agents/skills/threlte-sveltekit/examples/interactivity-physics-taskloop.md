# Interactivity, physics, and task-loop patterns

## Pointer interactivity

Use mesh pointer events for scene-native selection/hover, but avoid turning every triangle-heavy object into an interactive target.

Recommended pattern:

```svelte
<script lang="ts">
  import { T } from '@threlte/core'

  let selected = $state(false)
  let hovered = $state(false)
</script>

<T.Mesh
  scale={selected ? 1.15 : hovered ? 1.05 : 1}
  onpointerenter={() => hovered = true}
  onpointerleave={() => hovered = false}
  onclick={() => selected = !selected}
>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial color={selected ? 'orange' : 'white'} />
</T.Mesh>
```

If pointer events do not fire, configure the interactivity plugin/provider according to the project’s Threlte version.

## `useTask` pattern

```svelte
<script lang="ts">
  import { useTask } from '@threlte/core'

  const speed = 0.5

  useTask((delta) => {
    // no object allocations here
    // keep work small
  })
</script>
```

Rules:

- Do not allocate vectors/materials/geometries inside the callback.
- Do not update Svelte app state every frame unless the DOM truly needs it.
- Keep raw Three.js refs local to the scene component.
- Use `invalidate()` if the render mode is on-demand and mutations happen outside Threlte reactivity.

## Rapier skeleton

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
  import { World, RigidBody, Collider, Debug } from '@threlte/rapier'

  export let debug = false
</script>

<World gravity={[0, -9.81, 0]}>
  {#if debug}
    <Debug />
  {/if}

  <RigidBody type="fixed">
    <Collider shape="cuboid" args={[5, 0.1, 5]} />
    <T.Mesh position.y={-0.1}>
      <T.BoxGeometry args={[10, 0.2, 10]} />
      <T.MeshStandardMaterial color="#555" />
    </T.Mesh>
  </RigidBody>

  <RigidBody>
    <Collider shape="ball" args={[0.5]} />
    <T.Mesh position={[0, 3, 0]}>
      <T.SphereGeometry args={[0.5, 32, 32]} />
      <T.MeshStandardMaterial color="hotpink" />
    </T.Mesh>
  </RigidBody>
</World>
```

## Physics vs manual movement

Use manual movement for deterministic path-based behavior:

- tower-defense enemies;
- scripted camera paths;
- UI-like object transitions;
- product exploded views.

Use physics for emergent collisions and constraints:

- falling objects;
- pushing/stacking;
- joints;
- sensors/triggers;
- collision-heavy gameplay.
