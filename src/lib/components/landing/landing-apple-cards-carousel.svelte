<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import XIcon from '@lucide/svelte/icons/x';
	import { Badge } from '$lib/components/ui/badge';

	interface CarouselCard {
		category: string;
		title: string;
		image: string;
		imageAlt: string;
		body: string;
		points: readonly string[];
	}

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		cards?: readonly CarouselCard[];
	}

	let {
		kicker = 'Apple cards carousel',
		title = 'A high-impact card carousel for stories, use cases, and launches.',
		description = 'Based on Aceternity’s Apple Cards Carousel: large scroll-snap cards with image-led hierarchy and an expanded detail view.',
		cards = [
			{
				category: 'Launch story',
				title: 'From private beta to paid plan',
				image:
					'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Team planning a software launch',
				body: 'Use a card like this to turn customer stories, feature drops, or product updates into a visual carousel.',
				points: [
					'Hero-worthy image slot',
					'Modal detail view',
					'Works for changelogs and case studies'
				]
			},
			{
				category: 'Feature drop',
				title: 'Show the workflow behind the feature',
				image:
					'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Laptop with workflow notes',
				body: 'The expanded view gives teams a place for screenshots, bullets, customer notes, or launch context.',
				points: ['Scroll-snap rail', 'Keyboard-friendly modal', 'Strong image/copy split']
			},
			{
				category: 'Customer proof',
				title: 'Package a proof asset without a wall of text',
				image:
					'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Customer meeting at a conference table',
				body: 'The card format works well for testimonials that need a real image, a metric, and a little narrative.',
				points: [
					'Uneven proof alternative',
					'Great for founder video stills',
					'Compact enough for home pages'
				]
			},
			{
				category: 'Product tour',
				title: 'Give each app surface a cinematic tile',
				image:
					'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Product team reviewing analytics',
				body: 'Use the carousel to sequence dashboard, billing, onboarding, and settings surfaces without a long stacked page.',
				points: ['Horizontal exploration', 'Large visual slots', 'Simple data shape']
			}
		]
	}: Props = $props();

	let railRef: HTMLDivElement | undefined = $state();
	let activeIndex: number | undefined = $state();
	const activeCard = $derived(activeIndex === undefined ? undefined : cards[activeIndex]);

	function scrollRail(direction: -1 | 1) {
		railRef?.scrollBy({ left: direction * 360, behavior: 'smooth' });
	}

	function closeCard() {
		activeIndex = undefined;
	}

	function handleModalClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeCard();
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && activeIndex !== undefined) {
			closeCard();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<section class="border-y bg-muted/30 py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
			<div>
				<Badge variant="outline">{kicker}</Badge>
				<h2 class="mt-5 max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
					{title}
				</h2>
			</div>
			<p class="max-w-2xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
				{description}
			</p>
		</div>

		<div class="carousel-wrap mt-12">
			<div bind:this={railRef} class="apple-rail" aria-label="Landing story carousel">
				{#each cards as card, index (card.title)}
					<button type="button" class="apple-card" onclick={() => (activeIndex = index)}>
						<img src={card.image} alt={card.imageAlt} loading="lazy" decoding="async" />
						<span class="apple-card-scrim" aria-hidden="true"></span>
						<span class="apple-card-copy">
							<small>{card.category}</small>
							<strong>{card.title}</strong>
						</span>
					</button>
				{/each}
			</div>

			<div class="carousel-actions">
				<button type="button" aria-label="Scroll carousel left" onclick={() => scrollRail(-1)}>
					<ArrowLeftIcon class="size-4" />
				</button>
				<button type="button" aria-label="Scroll carousel right" onclick={() => scrollRail(1)}>
					<ArrowRightIcon class="size-4" />
				</button>
			</div>
		</div>
	</div>
</section>

{#if activeCard}
	<div class="card-modal" role="presentation" onclick={handleModalClick}>
		<div class="card-dialog" role="dialog" aria-modal="true" aria-labelledby="apple-card-title">
			<button type="button" class="card-close" aria-label="Close story" onclick={closeCard}>
				<XIcon class="size-5" />
			</button>
			<img src={activeCard.image} alt={activeCard.imageAlt} />
			<div class="card-dialog-copy">
				<Badge variant="secondary">{activeCard.category}</Badge>
				<h3 id="apple-card-title">{activeCard.title}</h3>
				<p>{activeCard.body}</p>
				<ul>
					{#each activeCard.points as point (point)}
						<li>{point}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}

<style>
	.carousel-wrap {
		position: relative;
	}

	.apple-rail {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		padding: 0.5rem 0 1.25rem;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.apple-rail::-webkit-scrollbar {
		display: none;
	}

	.apple-card {
		position: relative;
		display: block;
		overflow: hidden;
		width: min(24rem, 78vw);
		height: clamp(25rem, 50vw, 38rem);
		flex: 0 0 auto;
		border: 1px solid var(--border);
		border-radius: 1.35rem;
		background: var(--muted);
		padding: 0;
		text-align: left;
		scroll-snap-align: start;
		box-shadow: 0 18px 44px color-mix(in oklch, var(--foreground) 10%, transparent);
		cursor: pointer;
	}

	.apple-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 220ms ease;
	}

	.apple-card:hover img {
		transform: scale(1.035);
	}

	.apple-card-scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			color-mix(in oklch, black 56%, transparent),
			transparent 46%
		);
	}

	.apple-card-copy {
		position: absolute;
		top: 0;
		left: 0;
		display: grid;
		gap: 0.65rem;
		width: 100%;
		padding: 1.5rem;
		color: white;
	}

	.apple-card-copy small {
		font-size: 0.82rem;
		font-weight: 750;
		letter-spacing: 0;
	}

	.apple-card-copy strong {
		max-width: 18rem;
		font-size: clamp(1.5rem, 4vw, 2.2rem);
		font-weight: 720;
		line-height: 1.05;
		letter-spacing: 0;
		text-wrap: balance;
	}

	.carousel-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.carousel-actions button,
	.card-close {
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		place-items: center;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--background);
		color: var(--foreground);
	}

	.card-modal {
		position: fixed;
		z-index: 220;
		inset: 0;
		overflow-y: auto;
		background: color-mix(in oklch, black 62%, transparent);
		padding: 1rem;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	.card-dialog {
		position: relative;
		overflow: hidden;
		width: min(62rem, 100%);
		margin: 3rem auto;
		border: 1px solid var(--border);
		border-radius: 1.35rem;
		background: var(--background);
		box-shadow: 0 28px 90px color-mix(in oklch, black 34%, transparent);
	}

	.card-dialog > img {
		width: 100%;
		aspect-ratio: 16 / 7;
		object-fit: cover;
	}

	.card-dialog-copy {
		padding: clamp(1.5rem, 5vw, 3rem);
	}

	.card-dialog h3 {
		margin-top: 1rem;
		max-width: 42rem;
		font-size: clamp(2rem, 5vw, 4rem);
		font-weight: 720;
		line-height: 1;
		letter-spacing: 0;
		text-wrap: balance;
	}

	.card-dialog p {
		margin-top: 1rem;
		max-width: 42rem;
		color: var(--muted-foreground);
		font-size: 1.05rem;
		line-height: 1.8;
	}

	.card-dialog ul {
		margin-top: 1.5rem;
		display: grid;
		gap: 0.75rem;
	}

	.card-dialog li {
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		background: var(--muted);
		padding: 0.85rem 1rem;
	}

	.card-close {
		position: sticky;
		z-index: 2;
		top: 1rem;
		float: right;
		margin: 1rem;
	}
</style>
