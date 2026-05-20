<script lang="ts">
	import * as ScrollArea from '$lib/components/ui/scroll-area/index.js';
	import { cn } from '$lib/utils.js';

	let { class: className, children }: { class?: string; children?: import('svelte').Snippet } =
		$props();
</script>

<ScrollArea.Root class="w-full overflow-x-auto whitespace-nowrap">
	<div class={cn('flex w-max flex-nowrap items-center gap-2', className)}>
		{@render children?.()}
	</div>
</ScrollArea.Root>
