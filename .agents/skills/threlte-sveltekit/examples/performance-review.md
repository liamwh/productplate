# Threlte performance review guide

## First-pass diagnosis

Ask:

1. Is the scene static but rendering every frame?
2. Is the Canvas DPR too high for the device?
3. Are there too many draw calls?
4. Are shadows enabled everywhere?
5. Are models/textures too large?
6. Is `useTask` allocating or updating DOM state every frame?
7. Is raycasting hitting too many complex objects?
8. Is postprocessing stacked unnecessarily?
9. Are controls, physics, and animation all running when paused/hidden?
10. Is the route loading all assets upfront?

## Fast wins

- Use on-demand rendering for static scenes.
- Disable debug helpers in production.
- Reduce shadow casters.
- Lower texture resolution.
- Use GLB compression.
- Reuse materials.
- Use instancing for repeated meshes.
- Replace complex interactive meshes with simple invisible hit meshes.
- Lazy-load heavy scenes.
- Pause render loop when tab/route/scene is not visible.

## Code smell examples

### Allocating every frame

Bad:

```ts
useTask(() => {
  mesh.position.copy(new Vector3(x, y, z))
})
```

Better:

```ts
const scratch = new Vector3()

useTask(() => {
  scratch.set(x, y, z)
  mesh.position.copy(scratch)
})
```

### Updating Svelte state every frame

Bad:

```ts
useTask(() => {
  uiRotation = mesh.rotation.y
})
```

Better:

- keep frame-only values inside Three.js objects;
- update UI on important events or throttled intervals;
- expose stable derived states, not raw frame values.

### Complex raycast targets

Bad:

- every GLTF submesh clickable;
- raycasting against high-poly visual mesh.

Better:

- one simple transparent hit mesh;
- explicit object selection map;
- BVH/acceleration for large geometry.
