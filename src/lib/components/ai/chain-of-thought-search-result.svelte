<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { cn } from '$lib/utils.js';

	let { class: className, children }: { class?: string; children?: import('svelte').Snippet } =
		$props();
</script>

<Badge class={cn('gap-1 px-2 py-0.5 text-xs font-normal', className)} variant="secondary">
	{@render children?.()}
</Badge>
