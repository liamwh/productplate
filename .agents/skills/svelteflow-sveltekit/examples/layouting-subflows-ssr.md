# Layouting, subflows, and SvelteKit SSR notes

## Layouting

Auto-layout is a separate concern from Svelte Flow rendering.

Recommended pipeline:

```ts
async function applyLayout() {
  const layouted = await layoutWorkflow(nodes, edges)

  nodes = nodes.map((node) => {
    const next = layouted.positions.get(node.id)
    return next ? { ...node, position: next } : node
  })

  // optionally fit view after the DOM updates
}
```

Layout gotchas:

- Some algorithms need node width/height.
- Custom nodes may not have dimensions before first render.
- Async layout should be cancellable/debounced for large graphs.
- Layout should be a command, not something that fights user dragging continuously.
- Parent-child nodes require special handling.

## Subflows

Parent node must come before its children:

```ts
nodes = [
  {
    id: 'lane',
    type: 'group',
    position: { x: 80, y: 80 },
    data: { label: 'Lane' },
    style: 'width: 520px; height: 320px;'
  },
  {
    id: 'inside',
    parentId: 'lane',
    extent: 'parent',
    position: { x: 40, y: 60 },
    data: { label: 'Inside lane' }
  }
]
```

Use subflows for:

- groups;
- swimlanes;
- collapsed sections;
- compound nodes.

Avoid subflows for:

- ordinary visual grouping that can be represented by color;
- deeply nested workflow state that users cannot understand;
- fake layout hacks.

## SvelteKit SSR/client notes

Svelte Flow is a browser interaction component. Most usage works directly in SvelteKit route components, but watch for:

- browser-only APIs such as `crypto.randomUUID()` during SSR if used at module evaluation;
- localStorage access before browser;
- layout algorithms that require DOM measurement;
- components/hooks that assume provider context.

Keep graph data loading in `+page.server.ts` and editor behavior in client components.

If needed, gate browser-only behavior:

```svelte
<script lang="ts">
  import { browser } from '$app/environment'

  function addNode() {
    const id = browser && crypto.randomUUID
      ? crypto.randomUUID()
      : `node-${Date.now()}`
  }
</script>
```
