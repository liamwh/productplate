<script lang="ts">
	import { onMount, type Component } from 'svelte';

	let AgentPanel = $state<Component | null>(null);

	onMount(async () => {
		AgentPanel = (await import('./agent-panel.svelte')).default;
	});
</script>

{#if AgentPanel}
	<AgentPanel />
{:else}
	<div class="min-h-80 rounded-md border bg-card" aria-hidden="true"></div>
{/if}
