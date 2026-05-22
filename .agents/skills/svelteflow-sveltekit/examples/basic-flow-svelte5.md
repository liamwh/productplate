# Basic Svelte 5 Svelte Flow editor

```svelte
<script lang="ts">
  import {
    SvelteFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    type Node,
    type Edge
  } from '@xyflow/svelte'

  import '@xyflow/svelte/dist/style.css'

  let nodes = $state.raw<Node[]>([
    {
      id: 'start',
      type: 'input',
      position: { x: 0, y: 0 },
      data: { label: 'Start' }
    },
    {
      id: 'task-1',
      position: { x: 260, y: 120 },
      data: { label: 'Do work' }
    },
    {
      id: 'end',
      type: 'output',
      position: { x: 560, y: 0 },
      data: { label: 'End' }
    }
  ])

  let edges = $state.raw<Edge[]>([
    { id: 'start-task-1', source: 'start', target: 'task-1' },
    { id: 'task-1-end', source: 'task-1', target: 'end' }
  ])

  function addNode() {
    const id = crypto.randomUUID()

    nodes = [
      ...nodes,
      {
        id,
        position: { x: 160 + nodes.length * 40, y: 200 },
        data: { label: `Node ${nodes.length + 1}` }
      }
    ]
  }
</script>

<div class="flow-frame">
  <SvelteFlow bind:nodes bind:edges fitView>
    <Background />
    <Controls />
    <MiniMap />

    <Panel position="top-left">
      <button onclick={addNode}>Add node</button>
    </Panel>
  </SvelteFlow>
</div>

<style>
  .flow-frame {
    width: 100%;
    height: 70vh;
    min-height: 520px;
    border: 1px solid #e4e4e7;
    border-radius: 1rem;
    overflow: hidden;
  }
</style>
```

## Review points

- `style.css` is imported.
- Parent container has height.
- Nodes/edges use `$state.raw`.
- New node update replaces the array.
- `bind:nodes` and `bind:edges` allow Svelte Flow to update graph state during interaction.
