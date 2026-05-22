# Custom nodes and edges

## `src/lib/flow/node-types.ts`

```ts
import TaskNode from './nodes/TaskNode.svelte'
import DecisionNode from './nodes/DecisionNode.svelte'

export const nodeTypes = {
  task: TaskNode,
  decision: DecisionNode
}
```

## `src/lib/flow/edge-types.ts`

```ts
import ConditionEdge from './edges/ConditionEdge.svelte'

export const edgeTypes = {
  condition: ConditionEdge
}
```

## `TaskNode.svelte`

```svelte
<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte'

  type TaskData = {
    label: string
    description?: string
    invalid?: boolean
  }

  let { data, selected }: NodeProps<TaskData> = $props()
</script>

<div
  class:selected
  class:invalid={data.invalid}
  class="task-node"
>
  <Handle id="in" type="target" position={Position.Left} />

  <strong>{data.label}</strong>

  {#if data.description}
    <p>{data.description}</p>
  {/if}

  <button class="nodrag">Configure</button>

  <Handle id="out" type="source" position={Position.Right} />
</div>

<style>
  .task-node {
    min-width: 180px;
    border: 1px solid #d4d4d8;
    border-radius: 12px;
    background: white;
    padding: 12px;
  }

  .selected {
    outline: 2px solid #2563eb;
  }

  .invalid {
    border-color: #dc2626;
  }
</style>
```

## `ConditionEdge.svelte`

```svelte
<script lang="ts">
  import {
    BaseEdge,
    EdgeLabel,
    getBezierPath,
    type EdgeProps
  } from '@xyflow/svelte'

  type ConditionData = {
    label: string
  }

  let props: EdgeProps<ConditionData> = $props()

  const path = $derived(
    getBezierPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      sourcePosition: props.sourcePosition,
      targetX: props.targetX,
      targetY: props.targetY,
      targetPosition: props.targetPosition
    })
  )
</script>

<BaseEdge path={path[0]} markerEnd={props.markerEnd} />

<EdgeLabel x={path[1]} y={path[2]}>
  <span class="label nodrag nopan">
    {props.data?.label ?? 'condition'}
  </span>
</EdgeLabel>

<style>
  .label {
    border: 1px solid #d4d4d8;
    border-radius: 999px;
    background: white;
    padding: 3px 8px;
    font-size: 12px;
  }
</style>
```

## Usage

```svelte
<SvelteFlow
  bind:nodes
  bind:edges
  {nodeTypes}
  {edgeTypes}
/>
```

## Notes

- Define `nodeTypes` and `edgeTypes` in modules, not inline in a reactive block.
- Use `nodrag` for buttons/inputs inside nodes.
- Use `nopan` for edge label actions.
- Use explicit handle ids when a node has multiple handles.
