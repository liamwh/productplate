<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { cn } from '$lib/utils.js';

	let { class: className, children }: { class?: string; children?: import('svelte').Snippet } =
		$props();
</script>

<Collapsible.Content
	class={cn(
		'space-y-4 p-4 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2',
		className
	)}
>
	{@render children?.()}
</Collapsible.Content>
