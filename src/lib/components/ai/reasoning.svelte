<script lang="ts" module>
	import { getContext } from 'svelte';

	interface ReasoningContextValue {
		isStreaming: boolean;
		isOpen: boolean;
		setIsOpen: (open: boolean) => void;
		duration: number | undefined;
	}

	export const reasoningKey = Symbol('reasoning');

	export function useReasoning(): ReasoningContextValue {
		const context = getContext(reasoningKey) as ReasoningContextValue | null;
		if (!context) {
			throw new Error('Reasoning components must be used within Reasoning');
		}
		return context;
	}
</script>

<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { cn } from '$lib/utils.js';
	import { setContext } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: className,
		isStreaming = false,
		defaultOpen,
		onOpenChange,
		duration: durationProp,
		children
	}: HTMLAttributes<HTMLDivElement> & {
		isStreaming?: boolean;
		defaultOpen?: boolean;
		onOpenChange?: (open: boolean) => void;
		duration?: number;
	} = $props();

	const isExplicitlyClosed = $derived(defaultOpen === false);

	function getInitialOpen() {
		return defaultOpen ?? isStreaming;
	}

	function getInitialDuration() {
		return durationProp;
	}

	function getInitialHasEverStreamed() {
		return isStreaming;
	}

	let isOpen = $state(getInitialOpen());
	let duration = $state<number | undefined>(getInitialDuration());
	let hasEverStreamed = $state(getInitialHasEverStreamed());
	let hasAutoClosed = $state(false);
	let startTime: number | null = $state(null);

	$effect(() => {
		if (isStreaming) {
			hasEverStreamed = true;
			if (startTime === null) {
				startTime = Date.now();
			}
		} else if (startTime !== null) {
			duration = Math.ceil((Date.now() - startTime) / 1000);
			startTime = null;
		}
	});

	$effect(() => {
		if (durationProp !== undefined) {
			duration = durationProp;
		}
	});

	$effect(() => {
		if (isStreaming && !isOpen && !isExplicitlyClosed) {
			isOpen = true;
		}
	});

	$effect(() => {
		if (hasEverStreamed && !isStreaming && isOpen && !hasAutoClosed) {
			const timer = setTimeout(() => {
				isOpen = false;
				hasAutoClosed = true;
			}, 1000);
			return () => clearTimeout(timer);
		}
	});

	function handleOpenChange(newOpen: boolean) {
		isOpen = newOpen;
		onOpenChange?.(newOpen);
	}

	setContext(reasoningKey, {
		get isStreaming() {
			return isStreaming;
		},
		get isOpen() {
			return isOpen;
		},
		setIsOpen: handleOpenChange,
		get duration() {
			return duration;
		}
	});
</script>

<Collapsible.Root
	class={cn('not-prose mb-4', className)}
	onOpenChange={handleOpenChange}
	open={isOpen}
>
	{@render children?.()}
</Collapsible.Root>
