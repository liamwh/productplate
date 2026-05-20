<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { SearchIcon, ChevronDownIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		title,
		children
	}: {
		class?: string;
		title: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<Collapsible.Trigger
	class={cn(
		'group flex w-full cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
		className
	)}
>
	{#if children}
		{@render children()}
	{:else}
		<SearchIcon class="size-4" />
		<p class="text-sm">{title}</p>
		<ChevronDownIcon class="size-4 transition-transform group-data-[state=open]:rotate-180" />
	{/if}
</Collapsible.Trigger>
