# Svelte Flow review checklist

## Setup

- [ ] `@xyflow/svelte` is installed.
- [ ] `@xyflow/svelte/dist/style.css` or `base.css` is imported.
- [ ] Flow parent container has explicit height.
- [ ] Code targets the installed Svelte Flow version.
- [ ] Svelte 5 state uses `$state.raw` for nodes/edges where appropriate.

## Graph state

- [ ] Node ids and edge ids are stable.
- [ ] Nodes/edges are serializable.
- [ ] Node updates replace arrays/objects immutably.
- [ ] Edge updates replace arrays/objects immutably.
- [ ] Node `data` does not contain component references/functions.
- [ ] Persisted graph has a schema version.
- [ ] Server validates graph before saving/executing.

## Custom nodes/edges

- [ ] `nodeTypes` and `edgeTypes` are stable and not recreated every render.
- [ ] Custom node props are typed.
- [ ] Multiple handles have explicit ids.
- [ ] Dynamic handles call `useUpdateNodeInternals`.
- [ ] Buttons/inputs inside nodes use `nodrag`.
- [ ] Scrollable areas inside nodes use `nowheel`.
- [ ] Edge label controls use `nodrag`/`nopan`.
- [ ] Custom edge path uses a supported path helper or valid SVG path.

## Interaction

- [ ] Connection validation prevents invalid edges.
- [ ] Self-loops are allowed only if intentional.
- [ ] Duplicate edges are handled.
- [ ] Max input/output constraints are enforced if relevant.
- [ ] Deleting nodes clears/deletes connected edges appropriately.
- [ ] Selection state and inspector state stay in sync.
- [ ] Undo/redo batches drag operations instead of recording every mousemove.

## Layout/subflows

- [ ] Auto-layout does not fight manual dragging.
- [ ] Node dimensions are accounted for.
- [ ] Parent nodes appear before child nodes.
- [ ] Child `extent` is set intentionally.
- [ ] Layout handles subflows or explicitly excludes them.

## UX/accessibility

- [ ] Important actions use real buttons/inputs.
- [ ] Icon buttons have labels.
- [ ] Focus outlines are visible.
- [ ] Error/selected states are not color-only.
- [ ] Handles are large enough for the intended user.
- [ ] There is a fit/reset view action for large graphs.
- [ ] MiniMap is used only when it helps.

## Troubleshooting

- [ ] Broken visuals: check stylesheet import.
- [ ] Invisible flow: check parent height.
- [ ] Provider error: check `SvelteFlowProvider`.
- [ ] Stale node UI: check immutable update.
- [ ] Bad edge routing after dynamic handles: call `useUpdateNodeInternals`.
- [ ] Dragging while clicking buttons: add `nodrag`.
- [ ] Canvas pans while scrolling node content: add `nowheel`.
