---
name: svelteflow-sveltekit
description: Build, debug, and review SvelteKit node editors and graph UIs using Svelte Flow / @xyflow/svelte. Use this for workflow builders, visual programming, automation editors, graph diagrams, custom nodes/edges, handles, minimaps, graph persistence, validation, layouting, migration to Svelte Flow v1/Svelte 5, or troubleshooting pan/zoom/connection behavior.
---

# Svelte Flow + SvelteKit Agent Skill

## Mission

Build robust node-based editors and interactive diagrams in SvelteKit using Svelte Flow. The agent should produce correct Svelte 5-compatible examples, model graph state intentionally, use custom nodes and edges safely, preserve accessibility and keyboard interactions, import required styles, and avoid common state/update mistakes.

The skill covers:

- `@xyflow/svelte`
- `SvelteFlow`, `SvelteFlowProvider`
- nodes, edges, handles, custom node types, custom edge types
- `MiniMap`, `Controls`, `Background`, `Panel`
- hooks such as `useSvelteFlow`, `useUpdateNodeInternals`, and store access
- connection rules and graph validation
- persistence and backend data shape
- layouting and subflows
- Svelte 5 migration and state handling
- styling and theming
- troubleshooting

## Mental model

Svelte Flow renders an interactive graph editor made from:

- **nodes**: positioned entities with data and optional custom component type;
- **edges**: connections between nodes/handles with optional custom rendering;
- **handles**: connection points on nodes;
- **viewport**: pan/zoom transform;
- **controls**: minimap, zoom buttons, background, panels;
- **callbacks/events**: connection creation, selection, deletion, dragging, viewport changes;
- **external app state**: saved workflow, validation rules, backend sync, undo/redo.

Svelte Flow should own graph interaction mechanics. Your app owns domain semantics.

Do not encode domain state only in rendered DOM. Keep it in node/edge data and in a serializable graph model.

## Installation and CSS

Install:

```bash
npm install @xyflow/svelte
```

Always import Svelte Flow styles somewhere that applies to the flow component:

```ts
import '@xyflow/svelte/dist/style.css'
```

Use the base stylesheet only when you want to provide all theming yourself:

```ts
import '@xyflow/svelte/dist/base.css'
```

A missing stylesheet causes many "broken-looking" flows.

The flow’s parent container must have a real width and height:

```svelte
<div class="flow-frame">
  <SvelteFlow bind:nodes bind:edges />
</div>

<style>
  .flow-frame {
    width: 100%;
    height: 70vh;
    min-height: 500px;
  }
</style>
```

## Svelte 5 state rules

For Svelte Flow v1+ with Svelte 5, initialize large node and edge arrays with `$state.raw` and update them immutably.

```svelte
<script lang="ts">
  import { SvelteFlow, Background, Controls } from '@xyflow/svelte'
  import '@xyflow/svelte/dist/style.css'
  import type { Node, Edge } from '@xyflow/svelte'

  let nodes = $state.raw<Node[]>([
    {
      id: 'a',
      type: 'input',
      position: { x: 0, y: 0 },
      data: { label: 'Start' }
    },
    {
      id: 'b',
      position: { x: 260, y: 120 },
      data: { label: 'Step' }
    }
  ])

  let edges = $state.raw<Edge[]>([
    { id: 'a-b', source: 'a', target: 'b' }
  ])
</script>

<div class="flow-frame">
  <SvelteFlow bind:nodes bind:edges fitView>
    <Background />
    <Controls />
  </SvelteFlow>
</div>
```

Do not mutate nested node data in place and expect reliable updates. Create new arrays and new `data` objects.

Bad:

```ts
nodes[0].data.label = 'New label'
```

Good:

```ts
nodes = nodes.map((node) =>
  node.id === id
    ? { ...node, data: { ...node.data, label: 'New label' } }
    : node
)
```

This is especially important for custom nodes because their props update from node data.

## Basic graph data model

Minimum node:

```ts
{
  id: 'node-1',
  position: { x: 100, y: 100 },
  data: { label: 'Node 1' }
}
```

Minimum edge:

```ts
{
  id: 'edge-1',
  source: 'node-1',
  target: 'node-2'
}
```

Common additional fields:

- `type`: built-in or custom node/edge type.
- `sourceHandle` / `targetHandle`: specific handle ids.
- `selected`, `hidden`, `deletable`, `draggable`, `selectable`.
- `style`, `class`.
- `data`: custom serializable app data.
- `parentId`, `extent`: subflow/parenting behavior.

Use stable ids. Do not use array indexes as ids for saved graphs.

## Component structure

Recommended for non-trivial apps:

```text
src/routes/workflows/[id]/+page.svelte
src/lib/flow/WorkflowEditor.svelte
src/lib/flow/nodes/TaskNode.svelte
src/lib/flow/nodes/DecisionNode.svelte
src/lib/flow/edges/ConditionEdge.svelte
src/lib/flow/Toolbar.svelte
src/lib/flow/Inspector.svelte
src/lib/flow/graph.ts
src/lib/flow/validation.ts
src/lib/flow/layout.ts
src/lib/flow/persistence.ts
```

`+page.svelte` loads/saves data. `WorkflowEditor.svelte` owns Svelte Flow. `Inspector.svelte` edits selected node/edge data through immutable updates.

## Node types

Custom node components receive node props. Keep them presentation-focused and use node `data` for domain-specific values.

Example custom node:

```svelte
<script lang="ts">
  import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte'

  type TaskData = {
    label: string
    description?: string
    status?: 'idle' | 'running' | 'failed' | 'done'
  }

  let { id, data, selected }: NodeProps<TaskData> = $props()

  const { updateNodeData } = useSvelteFlow()

  function rename() {
    updateNodeData(id, {
      label: `${data.label}*`
    })
  }
</script>

<div class:selected class="task-node">
  <Handle type="target" position={Position.Left} />

  <button class="title nodrag" onclick={rename}>
    {data.label}
  </button>

  {#if data.description}
    <p>{data.description}</p>
  {/if}

  <Handle type="source" position={Position.Right} />
</div>

<style>
  .task-node {
    min-width: 180px;
    border: 1px solid var(--xy-node-border-color, #ddd);
    border-radius: 0.75rem;
    background: var(--xy-node-background-color, white);
    padding: 0.75rem;
  }

  .selected {
    outline: 2px solid var(--xy-theme-selected, #2563eb);
  }

  .title {
    font: inherit;
    font-weight: 700;
  }
</style>
```

Register node types outside the component or in a stable module so the object identity does not change on every render:

```ts
import TaskNode from './nodes/TaskNode.svelte'
import DecisionNode from './nodes/DecisionNode.svelte'

export const nodeTypes = {
  task: TaskNode,
  decision: DecisionNode
}
```

Use:

```svelte
<SvelteFlow {nodeTypes} bind:nodes bind:edges />
```

Do not recreate `nodeTypes` inline reactively unless you understand the warnings.

## Handles

Handles define connection points.

```svelte
<Handle id="in" type="target" position={Position.Left} />
<Handle id="success" type="source" position={Position.Right} />
<Handle id="failure" type="source" position={Position.Bottom} />
```

Rules:

- Use explicit handle ids when a node has multiple inputs/outputs.
- Store `sourceHandle` and `targetHandle` in edges.
- Use `useUpdateNodeInternals()` if handle count or position changes after render.
- Use CSS classes carefully. Handles must be measurable.
- Avoid `display: none` for handles that must still be measured. Use opacity/visibility when necessary.

Dynamic handles:

```svelte
<script lang="ts">
  import { Handle, Position, useUpdateNodeInternals, type NodeProps } from '@xyflow/svelte'

  type Data = { outputs: string[] }
  let { id, data }: NodeProps<Data> = $props()

  const updateNodeInternals = useUpdateNodeInternals()

  $effect(() => {
    data.outputs
    updateNodeInternals(id)
  })
</script>

{#each data.outputs as output}
  <Handle id={output} type="source" position={Position.Right} />
{/each}
```

## Edge types

Built-in edges are enough for many apps. Use custom edges when you need:

- custom labels/buttons;
- condition badges;
- animated paths;
- domain-specific colors/styles;
- edge-level actions;
- custom routing.

A custom edge typically uses path helpers and `BaseEdge`.

```svelte
<script lang="ts">
  import {
    BaseEdge,
    EdgeLabel,
    getBezierPath,
    type EdgeProps
  } from '@xyflow/svelte'

  type Data = { label?: string }

  let {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd
  }: EdgeProps<Data> = $props()

  const path = $derived(
    getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition
    })
  )
</script>

<BaseEdge path={path[0]} {markerEnd} />

{#if data?.label}
  <EdgeLabel x={path[1]} y={path[2]}>
    <button class="edge-label nodrag nopan">
      {data.label}
    </button>
  </EdgeLabel>
{/if}
```

Register edge types stably:

```ts
import ConditionEdge from './edges/ConditionEdge.svelte'

export const edgeTypes = {
  condition: ConditionEdge
}
```

## Connecting nodes

Use connection validation before creating domain edges.

With Svelte Flow v1, prefer the current connection lifecycle APIs. Validate connections based on:

- source node exists;
- target node exists;
- no self-loop unless allowed;
- source handle type/domain permits target handle;
- no duplicate edge for same source/target/handles;
- graph remains acyclic if required;
- max incoming/outgoing constraints;
- app-specific type compatibility.

Example helper:

```ts
import type { Connection, Edge, Node } from '@xyflow/svelte'

export function canConnect(
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): boolean {
  if (!connection.source || !connection.target) return false
  if (connection.source === connection.target) return false

  const duplicate = edges.some((edge) =>
    edge.source === connection.source &&
    edge.target === connection.target &&
    edge.sourceHandle === connection.sourceHandle &&
    edge.targetHandle === connection.targetHandle
  )

  return !duplicate
}
```

When creating edges, give them stable ids:

```ts
function edgeId(source: string, target: string, sourceHandle?: string | null, targetHandle?: string | null) {
  return `${source}:${sourceHandle ?? '_'}->${target}:${targetHandle ?? '_'}`
}
```

## Editing node data

Use an inspector panel for complex editing. Do not cram every form into the custom node.

Pattern:

1. User selects node.
2. `Inspector.svelte` receives selected node data.
3. User edits DOM form.
4. Parent immutably updates node data.
5. Custom node re-renders from `data`.

```ts
function updateNodeData(id: string, patch: Record<string, unknown>) {
  nodes = nodes.map((node) =>
    node.id === id
      ? { ...node, data: { ...node.data, ...patch } }
      : node
  )
}
```

For text inputs inside nodes:

- add `class="nodrag"` to prevent drag when interacting;
- add `class="nowheel"` to prevent scroll conflicts;
- stop propagation only if required;
- keep focus behavior predictable.

## Svelte Flow hooks

Use hooks inside components under `SvelteFlowProvider` or inside the `SvelteFlow` tree.

Common uses:

- `useSvelteFlow()`:
  - `fitView`;
  - `project`/coordinate transforms, depending on API;
  - `getNodes`, `getEdges`;
  - update helpers;
  - viewport utilities.
- `useUpdateNodeInternals()`:
  - call after dynamic handle changes.
- Store hooks:
  - read selected state, viewport, connection state, etc. when needed.

If a hook says the provider is missing, wrap the editor in `SvelteFlowProvider` or move the hook into a component rendered under `SvelteFlow`.

Example provider structure:

```svelte
<script lang="ts">
  import { SvelteFlowProvider } from '@xyflow/svelte'
  import WorkflowEditorInner from './WorkflowEditorInner.svelte'
</script>

<SvelteFlowProvider>
  <WorkflowEditorInner />
</SvelteFlowProvider>
```

## Controls, MiniMap, Background, Panel

Use built-ins first:

```svelte
<SvelteFlow bind:nodes bind:edges fitView>
  <Background />
  <Controls />
  <MiniMap />
  <Panel position="top-left">
    <button onclick={addNode}>Add node</button>
  </Panel>
</SvelteFlow>
```

Guidelines:

- `Controls` is useful for zoom/pan/fit.
- `MiniMap` is helpful for large graphs but can be noise for tiny graphs.
- `Background` improves spatial orientation.
- `Panel` is good for graph-local toolbars.
- For larger product UI, use external sidebars/inspectors outside the flow frame.

## Persistence

Persist a graph as serializable data:

```ts
type WorkflowGraph = {
  version: 1
  nodes: Array<{
    id: string
    type?: string
    position: { x: number; y: number }
    data: unknown
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
    type?: string
    data?: unknown
  }>
  viewport?: {
    x: number
    y: number
    zoom: number
  }
}
```

Persist:

- node ids;
- type;
- position;
- domain data;
- edge endpoints and handle ids;
- edge data;
- viewport if useful;
- schema version.

Do not persist:

- component references;
- functions;
- DOM state;
- transient selected/dragging state unless the product explicitly needs it.

Add a migration layer:

```ts
export function normalizeWorkflow(input: unknown): WorkflowGraph {
  // validate with zod/valibot/etc.
  // migrate old versions
  // provide defaults
}
```

## Undo/redo

For editors, undo/redo is often expected. Use a history model around graph changes.

Rules:

- Store snapshots or patches of nodes/edges.
- Do not push history entries for every mousemove during drag; push at drag end.
- Batch related changes.
- Keep max history length.
- Include node data edits, edge changes, layout changes.
- Decide whether viewport changes are undoable; usually not.

## Layouting

Svelte Flow does not solve your domain layout automatically by default. Use a layout algorithm when needed:

- Dagre / ELK for directed workflow layouts.
- Force layouts for network graphs.
- Manual user positioning for editors.
- Hybrid: auto-layout on import, manual after.

Layout pipeline:

1. Convert nodes/edges to layout graph.
2. Measure/estimate node sizes.
3. Run algorithm.
4. Write new `position` values immutably.
5. Fit view after layout.

Watch for:

- async layout libraries;
- node dimensions unavailable before first render;
- layout direction;
- subflow constraints;
- dynamic custom node sizes.

## Subflows / parent-child nodes

Use parent-child nodes when a node visually contains other nodes or a group/lane is needed.

Rules:

- Parent node must appear before children in the nodes array.
- Children use `parentId`.
- Use `extent: 'parent'` when children should be constrained to parent bounds.
- Be explicit about whether child positions are relative to parent.
- Avoid deep nesting unless the UX strongly needs it.
- Persist parent relationships.

Example:

```ts
nodes = [
  {
    id: 'group-1',
    type: 'group',
    position: { x: 100, y: 100 },
    data: { label: 'Group' },
    style: 'width: 400px; height: 300px;'
  },
  {
    id: 'child-1',
    parentId: 'group-1',
    extent: 'parent',
    position: { x: 40, y: 60 },
    data: { label: 'Inside' }
  }
]
```

## Styling and theming

Options:

- Import full style and override CSS variables.
- Import base style and define more yourself.
- Add custom node CSS inside node components.
- Add edge classes/styles via edge objects.

Rules:

- Avoid global CSS that accidentally breaks handles, edge labels, or SVG layers.
- Use `nodrag`, `nopan`, `nowheel` utility classes for interactive controls inside nodes/labels.
- Keep selected/error states visible.
- Use CSS variables for themes.
- Test dark mode.
- Keep node hit areas large enough.

Example CSS variable override:

```css
:global(.svelte-flow) {
  --xy-node-border-color: #d4d4d8;
  --xy-node-background-color: white;
  --xy-edge-stroke: #71717a;
}
```

## Accessibility

Svelte Flow provides graph interaction affordances, but custom content must still be accessible.

Guidelines:

- Use real buttons/inputs for actions.
- Add labels to icon-only buttons.
- Preserve keyboard operation.
- Avoid removing focus outlines.
- Make selected/error state visible without color alone.
- Ensure node text has contrast.
- Avoid tiny handles for critical connections.
- Provide non-graph alternatives for critical workflows when possible.
- Use inspector forms for keyboard-friendly editing.

## Validation model

For workflow builders, validate both local connections and whole-graph semantics.

Local connection validation:

- handles exist;
- types compatible;
- no duplicate;
- no invalid self-loop;
- max incoming/outgoing constraints.

Whole graph validation:

- required start node exists;
- all required config fields present;
- no disconnected required nodes;
- no cycles if DAG required;
- all branches from decision nodes covered;
- no unreachable nodes;
- no invalid terminal states;
- backend permissions and secrets resolved.

Represent validation errors:

```ts
type GraphIssue = {
  id: string
  severity: 'error' | 'warning'
  nodeId?: string
  edgeId?: string
  message: string
}
```

Use validation to decorate nodes/edges, not to mutate domain data destructively.

## Deletion and safety

When deleting nodes:

- delete connected edges;
- warn if deleting a node with important config;
- maintain history;
- clear inspector selection;
- validate resulting graph.

When deleting edges:

- update branch conditions if edge represented a named route;
- validate required outputs.

## Backend sync

For SvelteKit apps:

- Load graph in `+page.server.ts` or via API depending on auth/data needs.
- Validate server-side before saving.
- Store graph JSON plus metadata.
- Keep schema version.
- Consider optimistic local editing with explicit save.
- For collaboration, use a real-time backend or conflict strategy; Svelte Flow alone is not a multiplayer sync engine.

Backend storage examples:

- PostgreSQL JSONB for graph data + relational metadata.
- Separate tables for nodes/edges only if you need queryability across graph elements.
- Blob/object storage for huge graphs is rarely necessary.

## SvelteKit route pattern

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import WorkflowEditor from '$lib/flow/WorkflowEditor.svelte'

  let { data } = $props()
</script>

<WorkflowEditor initialGraph={data.workflow.graph} />
```

```ts
// +page.server.ts
export async function load({ params, locals }) {
  const workflow = await locals.db.workflow.findUnique(...)
  return { workflow }
}
```

Save through form action or API endpoint. For large interactive editors, an API endpoint is often cleaner than a SvelteKit form action because the payload is graph JSON and saves may be debounced or explicit.

## Common bugs and fixes

### Flow appears broken/un-styled

Likely missing:

```ts
import '@xyflow/svelte/dist/style.css'
```

### Flow is invisible

Parent container has no height. Add explicit height/min-height.

### Warning about nodeTypes/edgeTypes changing

Define `nodeTypes`/`edgeTypes` outside the component or in a stable module.

### Node data changed but UI did not update

You mutated nested data in place. Replace the node and its `data` object immutably.

### Handles moved or count changed but edges are wrong

Call `useUpdateNodeInternals(id)` after dynamic handle changes.

### Button inside node drags the node

Add `class="nodrag"` to the button/input.

### Scroll inside node pans the canvas

Add `class="nowheel"` to the scrollable area.

### Edge label button pans canvas

Use `nodrag` and `nopan` on edge-label controls.

### Hook provider error

Wrap with `SvelteFlowProvider` or move the hook under the flow tree.

### Edges connect to the wrong handle

Use explicit handle ids and set `sourceHandle`/`targetHandle`.

### Layout runs but positions look wrong

Check node dimensions, coordinate system, async timing, and whether parent-child positions are relative.

## Migration notes for Svelte Flow v1 / Svelte 5

When reviewing older code:

- `@xyflow/svelte` v1 is Svelte 5-oriented.
- Prefer `$state.raw` for nodes/edges.
- Use immutable array updates.
- Old callback/event names may have changed.
- Connection lifecycle may use newer `onbeforeconnect` patterns instead of old event names.
- Edge labels may use newer `EdgeLabel` patterns.
- Check docs before assuming React Flow examples translate one-to-one.

## Code-generation standards

When generating Svelte Flow code:

- Include the style import.
- Give the flow container a height.
- Use TypeScript types from `@xyflow/svelte`.
- Use `$state.raw` for initial node/edge arrays in Svelte 5 examples.
- Use `bind:nodes` and `bind:edges` for interactive editing.
- Register custom node/edge types stably.
- Use explicit handle ids for multiple handles.
- Use immutable updates for node/edge data.
- Add `nodrag`/`nowheel`/`nopan` where interactive DOM lives inside the graph.
- Include validation helpers for workflow builders.
- Keep domain logic outside visual node components where practical.
- Add persistence versioning for saved graphs.
- Do not invent exports. If unsure, say to verify against the installed `@xyflow/svelte` version.

## Review rubric

A good Svelte Flow implementation has:

- a sized parent container;
- imported styles;
- stable node/edge type registration;
- serializable graph model;
- immutable updates;
- explicit handle ids where needed;
- validation for connection/domain rules;
- persistence versioning;
- accessible custom node controls;
- sensible selection/inspector UX;
- no provider/hook misuse;
- no array-index ids;
- no hidden handles that Svelte Flow needs to measure;
- clear separation between graph mechanics and product semantics.
