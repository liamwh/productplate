<script lang="ts">
	interface StickyItem {
		title: string;
		description: string;
		preview: readonly string[];
	}

	interface Props {
		items?: readonly StickyItem[];
	}

	let {
		items = [
			{
				title: 'Start with the promise',
				description: 'Open with the outcome, then show the surface that supports it.',
				preview: ['Primary action', 'Founder quote', 'Live signup count']
			},
			{
				title: 'Show the product path',
				description: 'Landing to app shell to billing without separate screenshots.',
				preview: ['Dashboard route', 'Settings panel', 'Checkout copy']
			},
			{
				title: 'Close with proof',
				description: 'Testimonials, comparison points, and a priced objection.',
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

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-start">
			<div bind:this={scrollerRef} class="sticky-copy" onscroll={handleScroll}>
				{#each items as item, index (item.title)}
					<button
						type="button"
						class={['sticky-step', activeIndex === index ? 'sticky-step-active' : '']
							.filter(Boolean)
							.join(' ')}
						onclick={() => (activeIndex = index)}
					>
						<span class="sticky-index">0{index + 1}</span>
						<div>
							<strong>{item.title}</strong>
							<small>{item.description}</small>
						</div>
					</button>
				{/each}
				<div class="sticky-spacer" aria-hidden="true"></div>
			</div>

			<div class="sticky-preview" aria-live="polite">
				{#each activeItem.preview as row, index (row)}
					<div class="preview-row">
						<span>0{index + 1}</span>
						<p>{row}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.sticky-copy {
		display: grid;
		max-height: 30rem;
		gap: 0.25rem;
		overflow-y: auto;
		padding-right: 0.25rem;
		scrollbar-width: thin;
	}

	.sticky-step {
		display: grid;
		grid-template-columns: 2.5rem 1fr;
		gap: 1rem;
		border: 0;
		border-radius: 1rem;
		background: transparent;
		padding: 3rem 1rem;
		text-align: left;
		opacity: 0.4;
		transition:
			background-color 140ms ease,
			opacity 140ms ease;
	}

	.sticky-step-active {
		background: color-mix(in oklch, var(--background) 88%, transparent);
		opacity: 1;
	}

	.sticky-index {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--muted-foreground);
	}

	.sticky-step strong {
		display: block;
		font-size: clamp(1.25rem, 2.4vw, 1.75rem);
		font-weight: 650;
		line-height: 1.1;
		letter-spacing: -0.01em;
		text-wrap: balance;
	}

	.sticky-step small {
		display: block;
		margin-top: 0.4rem;
		max-width: 28rem;
		color: var(--muted-foreground);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.sticky-spacer {
		height: 6rem;
	}

	.sticky-preview {
		position: sticky;
		top: 5.5rem;
		display: grid;
		align-self: start;
		gap: 0.75rem;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		padding: 1.25rem;
		box-shadow: 0 18px 42px color-mix(in oklch, var(--foreground) 10%, transparent);
	}

	.preview-row {
		display: grid;
		grid-template-columns: 2.25rem 1fr;
		align-items: center;
		gap: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.7rem;
		background: color-mix(in oklch, var(--muted) 40%, transparent);
		padding: 0.75rem;
	}

	.preview-row span {
		color: var(--muted-foreground);
		font-size: 0.75rem;
		font-weight: 800;
	}

	.preview-row p {
		font-size: 0.95rem;
		font-weight: 600;
	}

	@media (prefers-reduced-motion: reduce) {
		.sticky-step {
			transition: none;
		}
	}
</style>
