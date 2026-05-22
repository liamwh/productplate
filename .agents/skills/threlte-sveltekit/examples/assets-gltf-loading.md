# GLTF/GLB loading pattern

## When to use which approach

Use `useGltf` when:

- prototyping;
- loading a single model;
- you only need the whole scene object.

Use `@threlte/gltf` generated components when:

- the model is part of production UI;
- you need named nodes/materials;
- you need typed access;
- you want cleaner variants and customization.

## Prototype with `useGltf`

```svelte
<script lang="ts">
  import { T } from '@threlte/core'
  import { useGltf } from '@threlte/extras'

  const model = useGltf('/models/chair.glb')
</script>

{#await $model}
  <T.Mesh>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshBasicMaterial color="gray" wireframe />
  </T.Mesh>
{:then gltf}
  <T is={gltf.scene} scale={1.25} />
{:catch error}
  <T.Mesh>
    <T.BoxGeometry args={[1, 0.1, 1]} />
    <T.MeshBasicMaterial color="red" />
  </T.Mesh>
{/await}
```

## Production advice

- Put public files under `static/models/...`.
- Prefer `.glb` over loose `.gltf` + external assets for deployment simplicity.
- Compress geometry and textures.
- Configure DRACO/KTX2/Meshopt decoders when the exported model uses them.
- Avoid enormous source textures. 4K textures are not harmless on mobile.
- Do not mutate cached shared materials unless all instances should change.
- Clone scenes/materials if instances need independent customization.
- Add a DOM loading overlay for real products.
- Test on a low-power laptop or phone, not only a desktop GPU.

## Configurator architecture

```text
ProductViewer.svelte
  Canvas
    ProductScene.svelte
      CameraRig.svelte
      Lighting.svelte
      ProductModel.svelte
  ProductControls.svelte
```

Keep user controls as DOM. Use Svelte state to drive material variants in the 3D model.
