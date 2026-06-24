<script lang="ts">
	import QuoteIcon from '@lucide/svelte/icons/quote';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	interface Testimonial {
		name: string;
		role: string;
		quote: string;
		image: string;
		imageAlt: string;
		size?: 'feature' | 'wide' | 'tall' | 'compact' | 'media' | 'normal';
		metric?: string;
		tone?: 'featured' | 'default';
	}

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		testimonials?: readonly Testimonial[];
		collapseByDefault?: boolean;
		collapsedHeight?: string;
		showMoreLabel?: string;
	}

	let {
		kicker = 'Proof sections',
		title = 'A mosaic proof wall for testimonials, screenshots, and founder signals.',
		description = 'Inspired by Aceternity and Magic UI proof blocks: uneven cards, real image slots, and enough density to feel like social proof instead of decoration.',
		testimonials = [
			{
				name: 'Mina Kim',
				role: 'Founder, Northstar Notes',
				quote:
					'We replaced a generic hero, pricing table, and FAQ in one afternoon. The sections were already shaped around actual SaaS routes.',
				image:
					'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a founder using the product',
				size: 'feature',
				metric: '14 sections shipped',
				tone: 'featured'
			},
			{
				name: 'Avery Reed',
				role: 'Indie maker',
				quote:
					'The best part is that the components are not hidden behind a package. I changed the markup, copy, and spacing directly.',
				image:
					'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of an indie maker',
				metric: '2.8x trial starts',
				size: 'tall'
			},
			{
				name: 'Jon Lane',
				role: 'Product engineer',
				quote:
					'The tabs and bento sections feel much more like components I would actually copy into a starter.',
				image:
					'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a product engineer',
				size: 'compact'
			},
			{
				name: 'Iris Park',
				role: 'Design partner',
				quote:
					'It gives founders a real launch page vocabulary: proof, comparison, pricing, product shots, and a final CTA.',
				image:
					'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
				imageAlt: 'Portrait of a design partner',
				metric: 'Copy passed first review',
				size: 'wide'
			},
			{
				name: 'Sam Kaur',
				role: 'Builder in residence',
				quote:
					'I used the comparison section to explain why our product was not another dashboard template.',
				image:
					'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a builder in residence',
				size: 'compact'
			},
			{
				name: 'Chris Noel',
				role: 'Early customer',
				quote:
					'The default copy is dummy data, but the structure is right. That made it much easier to write our real story.',
				image:
					'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of an early customer',
				size: 'tall'
			},
			{
				name: 'Nora Vale',
				role: 'Growth lead',
				quote:
					'The proof blocks gave us room for quotes, founder video stills, and specific outcomes without turning the page into a wall of identical cards.',
				image:
					'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
				imageAlt: 'Portrait of a growth lead',
				metric: '+31% activation',
				size: 'media'
			},
			{
				name: 'Launch room',
				role: 'Product screenshot slot',
				quote:
					'Swap this wide image with a founder video still, a customer Slack wall, or a real app screenshot.',
				image:
					'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'Workspace with desks and product planning boards',
				metric: 'Replace with your screenshot',
				size: 'wide'
			},
			{
				name: 'Theo Bright',
				role: 'Solo SaaS founder',
				quote:
					'The components made the launch page feel assembled, not decorated. I kept the grid and replaced every quote with customer language.',
				image:
					'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a solo SaaS founder',
				size: 'normal'
			},
			{
				name: 'Mosaic slot',
				role: 'Founder video still',
				quote: 'Use this compact card for a short video pull quote or clipped customer message.',
				image:
					'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
				imageAlt: 'People reviewing a product launch on laptops',
				size: 'media'
			},
			{
				name: 'Camila Stone',
				role: 'Agency founder',
				quote:
					'We used the wide proof slots for before-and-after screenshots and the compact ones for short client notes.',
				image:
					'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
				imageAlt: 'Portrait of an agency founder',
				metric: '4 launches reused it',
				size: 'wide'
			},
			{
				name: 'Dylan Moore',
				role: 'Developer advocate',
				quote:
					'The page gives teams more than one testimonial pattern, which matters when proof comes from tweets, calls, and product screenshots.',
				image:
					'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a developer advocate',
				size: 'normal'
			},
			{
				name: 'Feedback room',
				role: 'Customer call highlight',
				quote:
					'Use a tall card for a video transcript, a support win, or a quote that needs more breathing room.',
				image:
					'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
				imageAlt: 'A product team in a customer feedback room',
				size: 'tall'
			},
			{
				name: 'Maya Lin',
				role: 'Launch strategist',
				quote: 'The collapse makes a huge proof wall feel intentional instead of endless.',
				image:
					'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a launch strategist',
				size: 'compact'
			},
			{
				name: 'Ops board',
				role: 'Screenshot slot',
				quote:
					'Turn this into a customer dashboard screenshot, changelog capture, or wall of real launch comments.',
				image:
					'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
				imageAlt: 'A dashboard shown during a product operations meeting',
				metric: 'Proof asset slot',
				size: 'media'
			},
			{
				name: 'Rafael Costa',
				role: 'Technical founder',
				quote:
					'I kept the card composition and swapped in actual onboarding wins. It took longer to pick quotes than wire the section.',
				image:
					'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80',
				imageAlt: 'Portrait of a technical founder',
				size: 'normal'
			}
		],
		collapseByDefault = true,
		collapsedHeight = '46rem',
		showMoreLabel = 'Show more proof'
	}: Props = $props();

	let expanded = $state(isInitiallyExpanded());
	const shouldCollapse = $derived(collapseByDefault && testimonials.length > 8);

	function isInitiallyExpanded() {
		return !collapseByDefault;
	}
</script>

<section id="proof" class="scroll-mt-24 py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mx-auto max-w-3xl text-center">
			<Badge variant="outline">{kicker}</Badge>
			<h2 class="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h2>
			<p class="mt-5 text-lg leading-8 text-muted-foreground">{description}</p>
		</div>

		<div
			class={['proof-shell mt-12', shouldCollapse && !expanded ? 'proof-shell-collapsed' : '']
				.filter(Boolean)
				.join(' ')}
			style={`--proof-collapsed-height: ${collapsedHeight};`}
		>
			<div class="proof-mosaic">
				{#each testimonials as testimonial, index (testimonial.name)}
					<figure
						class={[
							'proof-card',
							testimonial.size ? `proof-card-${testimonial.size}` : '',
							testimonial.tone === 'featured' ? 'proof-card-featured-tone' : ''
						]
							.filter(Boolean)
							.join(' ')}
					>
						<div class="proof-media">
							<img
								src={testimonial.image}
								alt={testimonial.imageAlt}
								loading={index < 4 ? 'eager' : 'lazy'}
								decoding="async"
							/>
						</div>
						<div class="proof-body">
							<QuoteIcon class="size-5 opacity-70" />
							{#if testimonial.metric}
								<p class="proof-metric">{testimonial.metric}</p>
							{/if}
							<blockquote>"{testimonial.quote}"</blockquote>
						</div>
						<figcaption class="proof-caption">
							<span>{testimonial.name}</span>
							<small>{testimonial.role}</small>
						</figcaption>
					</figure>
				{/each}
			</div>

			{#if shouldCollapse && !expanded}
				<div class="proof-expand" aria-hidden="false">
					<Button variant="secondary" onclick={() => (expanded = true)}>{showMoreLabel}</Button>
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
		width: 100%;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.proof-media {
		position: relative;
		min-height: 5rem;
		background: var(--muted);
	}

	.proof-media img {
		width: 100%;
		height: 100%;
		min-height: 5rem;
		object-fit: cover;
		display: block;
	}

	.proof-card-compact .proof-media {
		min-height: 3.5rem;
	}

	.proof-card-wide .proof-media,
	.proof-card-media .proof-media {
		min-height: 6rem;
	}

	.proof-card-tall .proof-media {
		min-height: 8rem;
	}

	.proof-card-feature .proof-media {
		min-height: 9rem;
	}

	.proof-body {
		display: flex;
		min-height: 0;
		flex-direction: column;
		padding: 1rem 1rem 0;
	}

	.proof-metric {
		margin-top: 0.85rem;
		width: fit-content;
		border-radius: 999px;
		background: color-mix(in oklch, var(--foreground) 8%, transparent);
		padding: 0.25rem 0.6rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	.proof-body blockquote {
		margin-top: 0.6rem;
		color: var(--muted-foreground);
		font-size: 0.88rem;
		line-height: 1.55;
	}

	.proof-caption {
		display: grid;
		gap: 0.2rem;
		margin-top: auto;
		padding: 1rem 1rem;
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
		color: color-mix(in oklch, var(--primary-foreground) 72%, transparent);
	}

	.proof-card-featured-tone .proof-metric {
		background: color-mix(in oklch, var(--primary-foreground) 14%, transparent);
	}

	.proof-expand {
		position: absolute;
		z-index: 2;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		min-height: 13rem;
		align-items: end;
		justify-content: center;
		padding-bottom: 1.5rem;
		background: linear-gradient(
			to bottom,
			transparent,
			color-mix(in oklch, var(--background) 72%, transparent) 28%,
			var(--background) 76%
		);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	@media (min-width: 760px) {
		.proof-mosaic {
			grid-template-columns: repeat(6, minmax(0, 1fr));
			grid-auto-flow: dense;
			grid-auto-rows: minmax(6rem, auto);
		}

		.proof-card {
			grid-column: span 2;
		}

		.proof-card-feature {
			grid-column: span 3;
			grid-row: span 2;
		}

		.proof-card-wide,
		.proof-card-media {
			grid-column: span 3;
		}

		.proof-card-tall {
			grid-column: span 2;
			grid-row: span 2;
		}

		.proof-card-compact {
			grid-column: span 2;
		}
	}

	@media (min-width: 1120px) {
		.proof-mosaic {
			grid-template-columns: repeat(8, minmax(0, 1fr));
		}

		.proof-card {
			grid-column: span 2;
		}

		.proof-card-feature {
			grid-column: span 4;
			grid-row: span 2;
		}

		.proof-card-wide,
		.proof-card-media {
			grid-column: span 4;
		}

		.proof-card-tall {
			grid-column: span 2;
			grid-row: span 2;
		}

		.proof-card-compact {
			grid-column: span 2;
		}
	}
</style>
