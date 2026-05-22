# Persistence and validation pattern

## Graph type

```ts
import type { Node, Edge } from '@xyflow/svelte'

export type WorkflowGraph = {
  version: 1
  nodes: Node[]
  edges: Edge[]
  viewport?: {
    x: number
    y: number
    zoom: number
  }
}
```

## Validation helpers

```ts
import type { Connection, Edge, Node } from '@xyflow/svelte'

export type GraphIssue = {
  id: string
  severity: 'error' | 'warning'
  nodeId?: string
  edgeId?: string
  message: string
}

export function canConnect(connection: Connection, nodes: Node[], edges: Edge[]) {
  if (!connection.source || !connection.target) return false
  if (connection.source === connection.target) return false

  const source = nodes.find((node) => node.id === connection.source)
  const target = nodes.find((node) => node.id === connection.target)

  if (!source || !target) return false

  const duplicate = edges.some((edge) =>
    edge.source === connection.source &&
    edge.target === connection.target &&
    edge.sourceHandle === connection.sourceHandle &&
    edge.targetHandle === connection.targetHandle
  )

  return !duplicate
}

export function validateGraph(nodes: Node[], edges: Edge[]): GraphIssue[] {
  const issues: GraphIssue[] = []

  const nodeIds = new Set(nodes.map((node) => node.id))

  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      issues.push({
        id: `missing-source:${edge.id}`,
        severity: 'error',
        edgeId: edge.id,
        message: 'Edge source node does not exist.'
      })
    }

    if (!nodeIds.has(edge.target)) {
      issues.push({
        id: `missing-target:${edge.id}`,
        severity: 'error',
        edgeId: edge.id,
        message: 'Edge target node does not exist.'
      })
    }
  }

  const startNodes = nodes.filter((node) => node.type === 'input')
  if (startNodes.length === 0) {
    issues.push({
      id: 'missing-start',
      severity: 'error',
      message: 'Workflow needs a start node.'
    })
  }

  return issues
}
```

## Save payload

```ts
export function toSavePayload(nodes: Node[], edges: Edge[], viewport?: WorkflowGraph['viewport']): WorkflowGraph {
  return {
    version: 1,
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
      parentId: node.parentId,
      extent: node.extent
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      type: edge.type,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      data: edge.data
    })),
    viewport
  }
}
```

## Server-side rule

Never trust client graph validation as the only validation. Re-run schema/domain validation before saving or executing the workflow.
