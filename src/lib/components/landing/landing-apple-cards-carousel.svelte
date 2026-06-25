<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Badge } from '$lib/components/ui/badge';

	interface CarouselCard {
		category: string;
		title: string;
		image: string;
		imageAlt: string;
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
		description = 'Large scroll-snap cards with image-led hierarchy, image zoom on hover, and a compact scroll rail for fast scanning.',
		cards = [
			{
				category: 'Launch story',
				title: 'From private beta to paid plan',
				image:
					'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Team planning a software launch'
			},
			{
				category: 'Feature drop',
				title: 'Show the workflow behind the feature',
				image:
					'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Laptop with workflow notes'
			},
			{
				category: 'Customer proof',
				title: 'Package a proof asset without a wall of text',
				image:
					'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Customer meeting at a conference table'
			},
			{
				category: 'Product tour',
				title: 'Give each app surface a cinematic tile',
				image:
					'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Product team reviewing analytics'
			},
			{
				category: 'Changelog',
				title: 'Release notes that read like a story',
				image:
					'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Notebook and laptop on a wooden desk'
			}
		]
	}: Props = $props();

	let railRef: HTMLDivElement | undefined = $state();

	function scrollRail(direction: -1 | 1) {
		railRef?.scrollBy({ left: direction * 360, behavior: 'smooth' });
	}
</script>

<section class="py-20 sm:py-24">
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
				{#each cards as card (card.title)}
					<article class="apple-card">
						<img src={card.image} alt={card.imageAlt} loading="lazy" decoding="async" />
						<span class="apple-card-scrim" aria-hidden="true"></span>
						<span class="apple-card-copy">
							<small>{card.category}</small>
							<strong>{card.title}</strong>
						</span>
					</article>
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

	.carousel-actions button {
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		place-items: center;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--background);
		color: var(--foreground);
	}
</style>
