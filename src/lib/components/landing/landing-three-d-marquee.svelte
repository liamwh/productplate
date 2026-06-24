<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	interface MarqueeImage {
		src: string;
		alt: string;
	}

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		images?: readonly MarqueeImage[];
	}

	let {
		kicker = '3D marquee',
		title = 'A dimensional image wall for screenshots, launches, and customer proof.',
		description = 'Inspired by Aceternity’s 3D Marquee and Magic UI’s vertical marquee: four moving columns in a tilted plane, masked at the edges and paused on hover.',
		images = [
			{
				src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
				alt: 'Analytics dashboard'
			},
			{
				src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80',
				alt: 'Team planning software'
			},
			{
				src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
				alt: 'Laptop workflow'
			},
			{
				src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
				alt: 'Customer meeting'
			},
			{
				src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
				alt: 'Workspace'
			},
			{
				src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=900&q=80',
				alt: 'Product review'
			},
			{
				src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
				alt: 'Launch meeting'
			},
			{
				src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80',
				alt: 'Operations dashboard'
			},
			{
				src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
				alt: 'Team laptops'
			},
			{
				src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
				alt: 'Office planning boards'
			},
			{
				src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
				alt: 'Laptop analytics'
			},
			{
				src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
				alt: 'Strategy workshop'
			}
		]
	}: Props = $props();

	const columns = $derived(
		Array.from({ length: 4 }, (_, columnIndex) =>
			images.filter((_, imageIndex) => imageIndex % 4 === columnIndex)
		)
	);
</script>

<section class="border-y bg-muted/30 py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
			<div>
				<Badge variant="outline">{kicker}</Badge>
				<h2 class="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
					{title}
				</h2>
			</div>
			<p class="max-w-2xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
				{description}
			</p>
		</div>

		<div class="marquee-scene mt-12">
			<div class="marquee-plane">
				{#each columns as column, columnIndex (columnIndex)}
					<div
						class={['marquee-column', columnIndex % 2 === 0 ? '' : 'marquee-column-reverse']
							.filter(Boolean)
							.join(' ')}
					>
						{#each [...column, ...column] as image, imageIndex (`${image.src}-${imageIndex}`)}
							<figure aria-hidden={imageIndex >= column.length}>
								<img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
							</figure>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.marquee-scene {
		position: relative;
		isolation: isolate;
		display: grid;
		height: min(38rem, 78vw);
		min-height: 26rem;
		overflow: hidden;
		place-items: center;
		border: 1px solid var(--border);
		border-radius: 1.25rem;
		background: var(--background);
		perspective: 600px;
	}

	.marquee-scene::before,
	.marquee-scene::after {
		content: '';
		position: absolute;
		z-index: 2;
		pointer-events: none;
	}

	.marquee-scene::before {
		inset: 0;
		background:
			linear-gradient(
				to bottom,
				var(--background),
				transparent 18%,
				transparent 82%,
				var(--background)
			),
			linear-gradient(
				to right,
				var(--background),
				transparent 18%,
				transparent 82%,
				var(--background)
			);
	}

	.marquee-scene::after {
		inset: 0;
		background-image:
			linear-gradient(
				to right,
				color-mix(in oklch, var(--foreground) 8%, transparent) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				color-mix(in oklch, var(--foreground) 8%, transparent) 1px,
				transparent 1px
			);
		background-size: 72px 72px;
		mask-image: linear-gradient(to bottom, transparent, black 28%, black 72%, transparent);
		-webkit-mask-image: linear-gradient(to bottom, transparent, black 28%, black 72%, transparent);
	}

	.marquee-plane {
		display: grid;
		width: 88rem;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.4rem;
		transform: rotateX(54deg) rotateZ(-42deg) translateY(5rem);
		transform-style: preserve-3d;
	}

	.marquee-column {
		display: grid;
		gap: 1.4rem;
		animation: marquee-column 18s linear infinite;
	}

	.marquee-column-reverse {
		animation-direction: reverse;
		animation-duration: 23s;
	}

	.marquee-scene:hover .marquee-column {
		animation-play-state: paused;
	}

	.marquee-column figure {
		overflow: hidden;
		border: 1px solid color-mix(in oklch, var(--foreground) 12%, transparent);
		border-radius: 0.8rem;
		background: var(--muted);
		box-shadow: 0 18px 38px color-mix(in oklch, var(--foreground) 12%, transparent);
	}

	.marquee-column img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
		transition: transform 180ms ease;
	}

	.marquee-column figure:hover img {
		transform: translateY(-0.35rem);
	}

	@keyframes marquee-column {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(calc(-50% - 0.7rem));
		}
	}

	@media (max-width: 700px) {
		.marquee-plane {
			width: 58rem;
			transform: rotateX(54deg) rotateZ(-42deg) translateY(3rem) scale(0.78);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-column {
			animation: none;
		}
	}
</style>
