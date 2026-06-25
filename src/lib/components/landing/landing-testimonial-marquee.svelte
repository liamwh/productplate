<script lang="ts">
	import BrandLogo from './brand-logo.svelte';

	interface MarqueeTestimonial {
		name: string;
		role: string;
		quote: string;
		image: string;
		imageAlt: string;
		source: string;
	}

	interface Props {
		testimonials?: readonly MarqueeTestimonial[];
	}

	let {
		testimonials = [
			{
				name: 'Elena Torres',
				role: 'Founder, Ledger Loop',
				quote:
					'The components gave us enough range to build a real launch page without inventing every section.',
				image:
					'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
				imageAlt: 'Portrait of Elena Torres',
				source: 'X'
			},
			{
				name: 'Marcus Chen',
				role: 'Product lead',
				quote:
					'The page feels like a catalog of patterns we can copy, not a demo we have to reverse engineer.',
				image:
					'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
				imageAlt: 'Portrait of Marcus Chen',
				source: 'Reddit'
			},
			{
				name: 'Priya Shah',
				role: 'Design engineer',
				quote: 'The marquee works as a compact second proof pass after the big mosaic.',
				image:
					'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=300&q=80',
				imageAlt: 'Portrait of Priya Shah',
				source: 'PH'
			},
			{
				name: 'Rowan Moss',
				role: 'Indie maker',
				quote:
					'I replaced the dummy quotes with launch-day notes and kept the exact section structure.',
				image:
					'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80',
				imageAlt: 'Portrait of Rowan Moss',
				source: 'X'
			},
			{
				name: 'Ada Simon',
				role: 'Ops founder',
				quote: 'The proof sections gave us density without making every card the same size.',
				image:
					'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
				imageAlt: 'Portrait of Ada Simon',
				source: 'LinkedIn'
			},
			{
				name: 'Leo Grant',
				role: 'CTO',
				quote: 'Useful animations, no ornamental page gymnastics. That balance is hard to find.',
				image:
					'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
				imageAlt: 'Portrait of Leo Grant',
				source: 'Reddit'
			},
			{
				name: 'Nia Brooks',
				role: 'Growth consultant',
				quote:
					'The side-by-side comparison section finally explains the starter in business language.',
				image:
					'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80',
				imageAlt: 'Portrait of Nia Brooks',
				source: 'X'
			},
			{
				name: 'Mateo Ruiz',
				role: 'Builder',
				quote: 'Everything is still just source code, which makes the components easy to own.',
				image:
					'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80',
				imageAlt: 'Portrait of Mateo Ruiz',
				source: 'PH'
			}
		]
	}: Props = $props();

	const rows = $derived([
		testimonials.slice(0, Math.ceil(testimonials.length / 2)),
		testimonials.slice(Math.ceil(testimonials.length / 2))
	]);

	function duplicate(items: readonly MarqueeTestimonial[]) {
		return [...items, ...items];
	}
</script>

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6">
		<div class="marquee-stack mt-8">
			{#each rows as row, rowIndex (rowIndex)}
				<div class="marquee-row">
					<div
						class={['marquee-track', rowIndex % 2 === 1 ? 'marquee-track-reverse' : '']
							.filter(Boolean)
							.join(' ')}
					>
						{#each duplicate(row) as testimonial, index (`${testimonial.name}-${index}`)}
							<article class="marquee-card" aria-hidden={index >= row.length}>
								<div class="marquee-card-head">
									<img src={testimonial.image} alt={testimonial.imageAlt} loading="lazy" />
									<div>
										<strong>{testimonial.name}</strong>
										<span>{testimonial.role}</span>
									</div>
									<span
										class="marquee-source"
										aria-label={`Posted on ${testimonial.source}`}
										title={testimonial.source}
									>
										<BrandLogo source={testimonial.source} class="size-4" />
									</span>
								</div>
								<p>{testimonial.quote}</p>
							</article>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.marquee-stack {
		display: grid;
		gap: 1rem;
		overflow: hidden;
		mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
	}

	.marquee-row {
		overflow: hidden;
	}

	.marquee-track {
		display: flex;
		width: max-content;
		gap: 1rem;
		animation: testimonial-marquee 42s linear infinite;
	}

	.marquee-track-reverse {
		animation-direction: reverse;
		animation-duration: 48s;
	}

	.marquee-row:hover .marquee-track {
		animation-play-state: paused;
	}

	.marquee-card {
		display: grid;
		width: min(22rem, calc(100vw - 3rem));
		gap: 0.5rem;
		flex: 0 0 auto;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		padding: 1rem;
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.marquee-card-head {
		display: grid;
		grid-template-columns: 2.5rem 1fr 1.5rem;
		align-items: center;
		gap: 0.75rem;
	}

	.marquee-card img {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 999px;
		object-fit: cover;
	}

	.marquee-card strong,
	.marquee-card span {
		display: block;
	}

	.marquee-card strong {
		font-size: 0.95rem;
	}

	.marquee-card-head > div span {
		margin-top: 0.15rem;
		color: var(--muted-foreground);
		font-size: 0.78rem;
	}

	.marquee-source {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--muted-foreground);
	}

	.marquee-card p {
		color: var(--muted-foreground);
		font-size: 0.94rem;
		line-height: 1.65;
	}

	@keyframes testimonial-marquee {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(calc(-50% - 0.5rem));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
			flex-wrap: wrap;
			width: auto;
		}
	}
</style>
