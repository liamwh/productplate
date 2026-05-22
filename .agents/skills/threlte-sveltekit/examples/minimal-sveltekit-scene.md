# Minimal SvelteKit + Threlte scene

## Goal

A correct starter that avoids the most common mistakes:

- Canvas has a real size.
- Threlte hooks would live inside `Scene.svelte`, not the route page.
- Lit material has lights.
- Geometry/material are declaratively attached through `<T>`.

## `src/routes/threlte-demo/+page.svelte`

```svelte
<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from '$lib/threlte/Scene.svelte'
</script>

<section class="page">
  <div class="copy">
    <h1>Threlte demo</h1>
    <p>A simple 3D scene rendered with Threlte.</p>
  </div>

  <div class="scene-frame">
    <Canvas>
      <Scene />
    </Canvas>
  </div>
</section>

<style>
  .page {
    display: grid;
    gap: 1rem;
    padding: 2rem;
  }

  .scene-frame {
    width: 100%;
    height: min(70vh, 720px);
    min-height: 420px;
    border-radius: 1rem;
    overflow: hidden;
  }
</style>
```

## `src/lib/threlte/Scene.svelte`

```svelte
<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import type { Mesh } from 'three'

  let mesh = $state<Mesh>()

  useTask((delta) => {
    if (!mesh) return
    mesh.rotation.x += delta * 0.4
    mesh.rotation.y += delta * 0.7
  })
</script>

<T.PerspectiveCamera
  makeDefault
  position={[3, 2, 5]}
  lookAt={[0, 0, 0]}
/>

<T.AmbientLight intensity={0.35} />
<T.DirectionalLight position={[3, 5, 4]} intensity={1.4} />

<T.Mesh bind:ref={mesh} position.y={0.5}>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} position.y={-0.01}>
  <T.PlaneGeometry args={[8, 8]} />
  <T.MeshStandardMaterial color="#303030" />
</T.Mesh>
```

## Notes

For a static scene, remove `useTask`. Continuous per-frame mutation is only needed when something changes every frame.
