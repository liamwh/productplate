<script lang="ts" module>
	import type { ToolUIPart, DynamicToolUIPart } from 'ai';

	export type ToolPart = ToolUIPart | DynamicToolUIPart;

	export const statusLabels: Record<ToolPart['state'], string> = {
		'approval-requested': 'Awaiting Approval',
		'approval-responded': 'Responded',
		'input-available': 'Running',
		'input-streaming': 'Pending',
		'output-available': 'Completed',
		'output-denied': 'Denied',
		'output-error': 'Error'
	};
</script>

<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { cn } from '$lib/utils.js';

	let { class: className, children }: { class?: string; children?: import('svelte').Snippet } =
		$props();
</script>

<Collapsible.Root class={cn('group not-prose mb-4 w-full rounded-md border', className)}>
	{@render children?.()}
</Collapsible.Root>
