<script lang="ts">
	import { Streamdown } from 'svelte-streamdown';
	import Code from 'svelte-streamdown/code';
	import Mermaid from 'svelte-streamdown/mermaid';
	import Math from 'svelte-streamdown/math';
	import { cn } from '$lib/utils.js';
	let {
		class: className,
		content,
		animation
	}: {
		class?: string;
		content: string;
		animation?: boolean;
	} = $props();
</script>

<Streamdown
	class={cn('size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0', className)}
	components={{ code: Code, mermaid: Mermaid, math: Math }}
	animation={animation ? {} : undefined}
	{content}
/>
