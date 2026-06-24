<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	interface StickyItem {
		title: string;
		description: string;
		meta: string;
		preview: readonly string[];
	}

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		items?: readonly StickyItem[];
	}

	let {
		kicker = 'Sticky scroll reveal',
		title = 'A common long-form feature pattern without page-level scroll hacks.',
		description = 'Converted from Aceternity’s Sticky Scroll Reveal shape: text steps scroll inside a contained panel while the product preview updates beside them.',
		items = [
			{
				title: 'Start with the promise',
				description:
					'Open with the outcome, then use the sticky preview to show the exact product surface that supports it.',
				meta: 'Hero',
				preview: ['Primary action', 'Founder quote', 'Live signup count']
			},
			{
				title: 'Show the product path',
				description:
					'Move from landing page to app shell to billing without forcing visitors through separate screenshots.',
				meta: 'Flow',
				preview: ['Dashboard route', 'Settings panel', 'Checkout copy']
			},
			{
				title: 'Close with proof',
				description:
					'Use the final step for testimonials, comparison points, and the objection your pricing card answers.',
				meta: 'Proof',
				preview: ['Mosaic wall', 'Pricing matrix', 'FAQ answers']
			}
		]
	}: Props = $props();

	let activeIndex = $state(0);
	let scrollerRef: HTMLDivElement | undefined = $state();
	const activeItem = $derived(items[activeIndex] ?? items[0]);

	function handleScroll() {
		if (!scrollerRef || items.length === 0) return;

		const maxScroll = scrollerRef.scrollHeight - scrollerRef.clientHeight;
		if (maxScroll <= 0) return;

		const progress = scrollerRef.scrollTop / maxScroll;
		activeIndex = Math.min(items.length - 1, Math.round(progress * (items.length - 1)));
	}
</script>

<section class="py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
			<div>
				<Badge variant="outline">{kicker}</Badge>
				<h2 class="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
					{title}
				</h2>
				<p class="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{description}</p>
			</div>

			<div class="sticky-panel">
				<div bind:this={scrollerRef} class="sticky-copy" onscroll={handleScroll}>
					{#each items as item, index (item.title)}
						<button
							type="button"
							class={['sticky-step', activeIndex === index ? 'sticky-step-active' : '']
								.filter(Boolean)
								.join(' ')}
							onclick={() => (activeIndex = index)}
						>
							<span>{item.meta}</span>
							<strong>{item.title}</strong>
							<small>{item.description}</small>
						</button>
					{/each}
					<div class="sticky-spacer" aria-hidden="true"></div>
				</div>

				<div class="sticky-preview" aria-live="polite">
					<Badge variant="secondary">{activeItem.meta}</Badge>
					<h3>{activeItem.title}</h3>
					<div class="preview-window">
						{#each activeItem.preview as row, index (row)}
							<div>
								<span>0{index + 1}</span>
								<p>{row}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.sticky-panel {
		display: grid;
		gap: 1rem;
		border: 1px solid var(--border);
		border-radius: 1.25rem;
		background: color-mix(in oklch, var(--foreground) 7%, var(--background));
		padding: 1rem;
	}

	.sticky-copy {
		display: grid;
		max-height: 34rem;
		overflow-y: auto;
		padding-right: 0.25rem;
		scrollbar-width: thin;
	}

	.sticky-step {
		display: grid;
		gap: 0.8rem;
		border: 0;
		border-radius: 1rem;
		background: transparent;
		padding: 4rem 1rem;
		text-align: left;
		opacity: 0.42;
		transition:
			background-color 140ms ease,
			opacity 140ms ease;
	}

	.sticky-step-active {
		background: color-mix(in oklch, var(--background) 86%, transparent);
		opacity: 1;
	}

	.sticky-step span {
		width: fit-content;
		border-radius: 999px;
		background: var(--muted);
		padding: 0.28rem 0.6rem;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	.sticky-step strong {
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 700;
		line-height: 1.08;
		letter-spacing: 0;
		text-wrap: balance;
	}

	.sticky-step small {
		max-width: 30rem;
		color: var(--muted-foreground);
		font-size: 1rem;
		line-height: 1.75;
	}

	.sticky-spacer {
		height: 8rem;
	}

	.sticky-preview {
		position: sticky;
		top: 5.25rem;
		display: grid;
		align-self: start;
		gap: 1rem;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--background);
		padding: 1.25rem;
		box-shadow: 0 18px 42px color-mix(in oklch, var(--foreground) 10%, transparent);
	}

	.sticky-preview h3 {
		max-width: 24rem;
		font-size: clamp(1.6rem, 3.4vw, 2.5rem);
		font-weight: 720;
		line-height: 1;
		letter-spacing: 0;
		text-wrap: balance;
	}

	.preview-window {
		display: grid;
		gap: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: color-mix(in oklch, var(--muted) 50%, transparent);
		padding: 0.85rem;
	}

	.preview-window div {
		display: grid;
		grid-template-columns: 2.25rem 1fr;
		align-items: center;
		gap: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--background);
		padding: 0.75rem;
	}

	.preview-window span {
		color: var(--muted-foreground);
		font-size: 0.75rem;
		font-weight: 800;
	}

	.preview-window p {
		font-size: 0.95rem;
		font-weight: 650;
	}

	@media (min-width: 900px) {
		.sticky-panel {
			grid-template-columns: 1fr 0.85fr;
			align-items: start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sticky-step {
			transition: none;
		}
	}
</style>
