<script lang="ts">
	import QuoteIcon from '@lucide/svelte/icons/quote';
	import { Button } from '$lib/components/ui/button';

	interface Testimonial {
		name: string;
		role: string;
		quote: string;
		image: string;
		imageAlt: string;
		span?: 'feature' | 'wide' | 'tall';
		metric?: string;
		tone?: 'featured' | 'default';
	}

	interface Props {
		testimonials?: readonly Testimonial[];
		collapseByDefault?: boolean;
		collapsedHeight?: string;
		showMoreLabel?: string;
	}

	let {
		testimonials = [
			{
				name: 'Mina Kim',
				role: 'Founder, Northstar Notes',
				quote:
					'We replaced a hero, pricing table, and FAQ in one afternoon. The sections were already shaped around real SaaS routes.',
				image:
					'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
				imageAlt: 'Portrait of a founder',
				span: 'feature',
				metric: '14 sections shipped',
				tone: 'featured'
			},
			{
				name: 'Avery Reed',
				role: 'Indie maker',
				quote:
					'The components are not hidden behind a package. I changed markup, copy, and spacing directly.',
				image:
					'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of an indie maker',
				metric: '2.8x trial starts',
				span: 'tall'
			},
			{
				name: 'Jon Lane',
				role: 'Product engineer',
				quote:
					'The tabs and bento sections feel like components I would actually copy into a starter.',
				image:
					'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a product engineer'
			},
			{
				name: 'Iris Park',
				role: 'Design partner',
				quote:
					'It gives founders a real launch page vocabulary: proof, comparison, pricing, and a final CTA.',
				image:
					'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
				imageAlt: 'Portrait of a design partner',
				metric: 'Copy passed first review',
				span: 'wide'
			},
			{
				name: 'Sam Kaur',
				role: 'Builder in residence',
				quote:
					'I used the comparison section to explain why our product was not another dashboard template.',
				image:
					'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a builder'
			},
			{
				name: 'Chris Noel',
				role: 'Early customer',
				quote:
					'The default copy is dummy data, but the structure is right. That made it easier to write our real story.',
				image:
					'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of an early customer',
				span: 'tall'
			},
			{
				name: 'Nora Vale',
				role: 'Growth lead',
				quote:
					'Room for quotes, founder video stills, and specific outcomes without turning the page into a wall of identical cards.',
				image:
					'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
				imageAlt: 'Portrait of a growth lead',
				metric: '+31% activation',
				span: 'wide'
			},
			{
				name: 'Theo Bright',
				role: 'Solo SaaS founder',
				quote:
					'The page felt assembled, not decorated. I kept the grid and replaced every quote with customer language.',
				image:
					'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a solo founder'
			},
			{
				name: 'Launch room',
				role: 'Screenshot slot',
				quote:
					'Swap this slot with a founder video still, a customer Slack wall, or a real app screenshot.',
				image:
					'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Workspace with product planning boards',
				metric: 'Proof asset slot',
				span: 'feature'
			},
			{
				name: 'Camila Stone',
				role: 'Agency founder',
				quote:
					'We used the wide slots for before-and-after screenshots and the compact ones for client notes.',
				image:
					'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
				imageAlt: 'Portrait of an agency founder',
				metric: '4 launches reused it',
				span: 'wide'
			}
		],
		collapseByDefault = true,
		collapsedHeight = '42rem',
		showMoreLabel = 'Show more proof'
	}: Props = $props();

	function isInitiallyExpanded() {
		return !collapseByDefault;
	}

	let expanded = $state(isInitiallyExpanded());
	const shouldCollapse = $derived(collapseByDefault && testimonials.length > 6);

	function expand() {
		expanded = true;
	}
</script>

<section id="proof" class="scroll-mt-24 py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6">
		<div
			class={['proof-shell', shouldCollapse && !expanded ? 'proof-shell-collapsed' : '']
				.filter(Boolean)
				.join(' ')}
			style={`--proof-collapsed-height: ${collapsedHeight};`}
		>
			<div class="proof-mosaic">
				{#each testimonials as testimonial, index (testimonial.name)}
					<figure
						class={[
							'proof-card',
							testimonial.span ? `proof-card-${testimonial.span}` : '',
							testimonial.tone === 'featured' ? 'proof-card-featured-tone' : ''
						]
							.filter(Boolean)
							.join(' ')}
					>
						{#if testimonial.span === 'feature' || testimonial.span === 'wide' || testimonial.span === 'tall'}
							<div class="proof-media">
								<img
									src={testimonial.image}
									alt={testimonial.imageAlt}
									loading={index < 4 ? 'eager' : 'lazy'}
									decoding="async"
								/>
							</div>
						{/if}
						<div class="proof-body">
							<QuoteIcon class="size-5 opacity-70" />
							{#if testimonial.metric}
								<p class="proof-metric">{testimonial.metric}</p>
							{/if}
							<blockquote>{testimonial.quote}</blockquote>
						</div>
						<figcaption class="proof-caption">
							<span>{testimonial.name}</span>
							<small>{testimonial.role}</small>
						</figcaption>
					</figure>
				{/each}
			</div>

			{#if shouldCollapse && !expanded}
				<div class="proof-expand">
					<Button variant="secondary" onclick={expand}>{showMoreLabel}</Button>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.proof-shell {
		position: relative;
		isolation: isolate;
	}

	.proof-shell-collapsed {
		max-height: var(--proof-collapsed-height);
		overflow: hidden;
	}

	.proof-mosaic {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.proof-card {
		display: flex;
		min-height: 11rem;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.proof-media {
		position: relative;
		flex: 1 1 auto;
		min-height: 6rem;
		background: var(--muted);
	}

	.proof-media img {
		width: 100%;
		height: 100%;
		min-height: 6rem;
		object-fit: cover;
		display: block;
	}

	.proof-body {
		display: flex;
		min-height: 0;
		flex-direction: column;
		padding: 1.1rem 1.1rem 0;
	}

	.proof-metric {
		margin-top: 0.6rem;
		width: fit-content;
		border-radius: 999px;
		background: color-mix(in oklch, var(--foreground) 8%, transparent);
		padding: 0.22rem 0.55rem;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.proof-body blockquote {
		margin-top: 0.55rem;
		color: var(--muted-foreground);
		font-size: 0.9rem;
		line-height: 1.55;
	}

	.proof-caption {
		display: grid;
		gap: 0.2rem;
		margin-top: auto;
		padding: 1rem 1.1rem;
	}

	.proof-caption span {
		font-weight: 650;
	}

	.proof-caption small {
		color: var(--muted-foreground);
		font-size: 0.75rem;
	}

	.proof-card-featured-tone {
		background: var(--primary);
		color: var(--primary-foreground);
	}

	.proof-card-featured-tone .proof-body blockquote,
	.proof-card-featured-tone .proof-caption small {
		color: color-mix(in oklch, var(--primary-foreground) 78%, transparent);
	}

	.proof-card-featured-tone .proof-metric {
		background: color-mix(in oklch, var(--primary-foreground) 16%, transparent);
	}

	.proof-expand {
		position: absolute;
		z-index: 2;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		min-height: 11rem;
		align-items: end;
		justify-content: center;
		padding-bottom: 1.5rem;
		background: linear-gradient(
			to bottom,
			transparent,
			color-mix(in oklch, var(--background) 72%, transparent) 28%,
			var(--background) 78%
		);
	}

	@media (min-width: 640px) {
		.proof-mosaic {
			grid-template-columns: repeat(6, minmax(0, 1fr));
			grid-auto-flow: dense;
			grid-auto-rows: minmax(7rem, auto);
		}

		.proof-card {
			grid-column: span 2;
		}

		.proof-card-wide {
			grid-column: span 3;
		}

		.proof-card-tall {
			grid-column: span 2;
			grid-row: span 2;
		}

		.proof-card-feature {
			grid-column: span 4;
			grid-row: span 2;
		}
	}

	@media (min-width: 1024px) {
		.proof-card {
			grid-column: span 2;
		}

		.proof-card-wide {
			grid-column: span 3;
		}

		.proof-card-tall {
			grid-column: span 2;
			grid-row: span 2;
		}

		.proof-card-feature {
			grid-column: span 3;
			grid-row: span 2;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.proof-shell-collapsed {
			max-height: none;
			overflow: visible;
		}
	}
</style>
