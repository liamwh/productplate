<script lang="ts">
	import { motion } from '@humanspeak/svelte-motion';
	import { prefersReducedMotion } from 'svelte/motion';

	interface MarqueeImage {
		src: string;
		alt: string;
	}

	interface Props {
		images?: readonly MarqueeImage[];
	}

	let {
		images = [
			{
				src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
				alt: 'Analytics dashboard'
			},
			{
				src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80',
				alt: 'Team planning'
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
				alt: 'Office boards'
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

	const reduceMotion = $derived(prefersReducedMotion.current);
	const chunkSize = $derived(Math.ceil(images.length / 4));
	const columns = $derived(
		Array.from({ length: 4 }, (_, colIndex) =>
			images.slice(colIndex * chunkSize, colIndex * chunkSize + chunkSize)
		)
	);
</script>

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6">
		<div class="marquee-scene">
			<div class="marquee-center">
				<div class="marquee-scale">
					<div class="marquee-plane">
						{#each columns as column, colIndex (colIndex)}
							<motion.div
								animate={{ y: reduceMotion ? 0 : colIndex % 2 === 0 ? 100 : -100 }}
								transition={{
									duration: colIndex % 2 === 0 ? 10 : 15,
									repeat: reduceMotion ? 0 : Infinity,
									repeatType: 'reverse',
									ease: 'easeInOut'
								}}
								class="marquee-column"
							>
								<div class="grid-line-v" aria-hidden="true"></div>
								{#each column as image, imageIndex (`${image.src}-${imageIndex}`)}
									<div class="marquee-item">
										<div class="grid-line-h" aria-hidden="true"></div>
										<motion.img
											src={image.src}
											alt={image.alt}
											loading="lazy"
											decoding="async"
											whileHover={{ y: reduceMotion ? 0 : -10 }}
											transition={{ duration: 0.3, ease: 'easeInOut' }}
										/>
									</div>
								{/each}
							</motion.div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.marquee-scene {
		position: relative;
		block-size: 600px;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--background);
		perspective: 1000px;
	}

	.marquee-center {
		display: flex;
		block-size: 100%;
		align-items: center;
		justify-content: center;
	}

	.marquee-scale {
		inline-size: 1720px;
		block-size: 1720px;
		flex: 0 0 auto;
		scale: 0.5;
	}

	.marquee-plane {
		position: relative;
		display: grid;
		inline-size: 100%;
		block-size: 100%;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
		transform: rotateX(55deg) rotateY(0deg) rotateZ(-45deg);
		transform-style: preserve-3d;
		transform-origin: top left;
		translate: 24rem 0;
	}

	:global(.marquee-column) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2rem;
	}

	.marquee-item {
		position: relative;
	}

	.grid-line-v {
		position: absolute;
		left: -1rem;
		block-size: 100%;
		inline-size: 1px;
		background: color-mix(in oklch, var(--foreground) 10%, transparent);
	}

	.grid-line-h {
		position: absolute;
		top: -1rem;
		inline-size: 100%;
		block-size: 1px;
		background: color-mix(in oklch, var(--foreground) 10%, transparent);
	}

	.marquee-scene :global(img) {
		inline-size: 100%;
		aspect-ratio: 970 / 700;
		border-radius: 0.6rem;
		object-fit: cover;
		box-shadow: 0 0 0 1px color-mix(in oklch, var(--foreground) 6%, transparent);
	}

	@media (min-width: 640px) {
		.marquee-scale {
			scale: 0.75;
		}
	}

	@media (min-width: 1024px) {
		.marquee-scale {
			scale: 1;
		}
	}

	@media (max-width: 639px) {
		.marquee-scene {
			block-size: 400px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-scale {
			scale: 0.6;
		}
	}
</style>
