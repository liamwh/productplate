<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { cn } from '$lib/utils.js';

	let {
		defaultOpen = true,
		open,
		onOpenChange,
		class: className,
		children
	}: {
		defaultOpen?: boolean;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();

	let isOpen = $state(open ?? defaultOpen);

	$effect(() => {
		if (open !== undefined) {
			isOpen = open;
		}
	});

	function handleOpenChange(value: boolean) {
		isOpen = value;
		onOpenChange?.(value);
	}
</script>

<Collapsible.Root class={cn(className)} open={isOpen} onOpenChange={handleOpenChange}>
	{@render children?.()}
</Collapsible.Root>
