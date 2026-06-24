<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	interface Option {
		name: string;
		eyebrow: string;
		summary: string;
		outcome: string;
		items: readonly { label: string; included: boolean }[];
		highlight?: boolean;
	}

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		options?: readonly Option[];
	}

	let {
		kicker = 'Comparison',
		title = 'Show the tradeoff without dropping visitors into a spreadsheet.',
		description = 'Adapted from Aceternity’s compare pattern: a quick before/after product frame first, then compact option lanes for the real buying decision.',
		options = [
			{
				name: 'Static template',
				eyebrow: 'Fast start',
				summary: 'Pretty sections, but the app work still waits behind the page.',
				outcome: 'Best for experiments',
				items: [
					{ label: 'Reusable marketing blocks', included: true },
					{ label: 'Authenticated app routes', included: false },
					{ label: 'Backend and billing path', included: false },
					{ label: 'Design system in repo', included: true }
				]
			},
			{
				name: 'Product Plate',
				eyebrow: 'Starter',
				summary:
					'Landing sections, auth, app shell, data, billing, and docs stay in one editable codebase.',
				outcome: 'Best for shipping',
				highlight: true,
				items: [
					{ label: 'Reusable marketing blocks', included: true },
					{ label: 'Authenticated app routes', included: true },
					{ label: 'Backend and billing path', included: true },
					{ label: 'Design system in repo', included: true }
				]
			},
			{
				name: 'Custom build',
				eyebrow: 'Highest control',
				summary:
					'Everything can fit perfectly, but the useful first version takes longer to reach.',
				outcome: 'Best after traction',
				items: [
					{ label: 'Reusable marketing blocks', included: true },
					{ label: 'Authenticated app routes', included: true },
					{ label: 'Backend and billing path', included: true },
					{ label: 'Design system in repo', included: false }
				]
			}
		]
	}: Props = $props();
</script>

<section class="py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
			<div>
				<Badge variant="outline">{kicker}</Badge>
				<h2 class="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
					{title}
				</h2>
				<p class="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{description}</p>
				<Button href="#pricing" variant="outline" class="mt-8">
					Compare plans
					<ArrowRightIcon data-icon="inline-end" />
				</Button>
			</div>

			<div class="grid gap-4">
				<div class="compare-frame" aria-label="Before and after product comparison">
					<div class="compare-panel compare-before">
						<div class="compare-label">Before</div>
						<div class="messy-shell">
							<div class="messy-hero"></div>
							<div class="messy-grid">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
							<div class="messy-footer"></div>
						</div>
					</div>

					<div class="compare-panel compare-after">
						<div class="compare-label">After</div>
						<div class="clean-shell">
							<div class="clean-sidebar">
								<span></span>
								<span></span>
								<span></span>
							</div>
							<div class="clean-main">
								<div class="clean-header"></div>
								<div class="clean-metrics">
									<span></span>
									<span></span>
									<span></span>
								</div>
								<div class="clean-list">
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>
						</div>
					</div>

					<div class="compare-divider" aria-hidden="true">
						<span></span>
					</div>
				</div>

				<div class="option-lanes">
					{#each options as option (option.name)}
						<article
							class={['option-lane', option.highlight ? 'option-lane-highlight' : '']
								.filter(Boolean)
								.join(' ')}
						>
							<div class="option-head">
								<Badge variant={option.highlight ? 'default' : 'secondary'}>{option.eyebrow}</Badge>
								<h3>{option.name}</h3>
								<p>{option.summary}</p>
							</div>
							<ul>
								{#each option.items as item (item.label)}
									<li>
										<span class={item.included ? 'included' : 'missing'}>
											{#if item.included}
												<CheckIcon class="size-4" />
											{:else}
												<MinusIcon class="size-4" />
											{/if}
										</span>
										{item.label}
									</li>
								{/each}
							</ul>
							<p class="option-outcome">{option.outcome}</p>
						</article>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.compare-frame {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		min-height: 24rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--muted);
	}

	.compare-panel {
		position: absolute;
		inset: 0;
		padding: 1rem;
	}

	.compare-before {
		background:
			linear-gradient(135deg, color-mix(in oklch, var(--muted) 70%, transparent), transparent),
			var(--card);
	}

	.compare-after {
		clip-path: inset(0 0 0 52%);
		background: var(--background);
		transition: clip-path 260ms ease;
	}

	.compare-frame:hover .compare-after {
		clip-path: inset(0 0 0 18%);
	}

	.compare-label {
		position: absolute;
		z-index: 2;
		top: 1rem;
		left: 1rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: color-mix(in oklch, var(--background) 92%, transparent);
		padding: 0.25rem 0.6rem;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.compare-after .compare-label {
		left: auto;
		right: 1rem;
	}

	.compare-divider {
		position: absolute;
		z-index: 4;
		top: 0;
		bottom: 0;
		left: 52%;
		width: 1px;
		background: linear-gradient(to bottom, transparent, var(--primary), transparent);
		transition: left 260ms ease;
	}

	.compare-frame:hover .compare-divider {
		left: 18%;
	}

	.compare-divider span {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--background);
		box-shadow: 0 10px 24px color-mix(in oklch, var(--foreground) 12%, transparent);
		transform: translate(-50%, -50%);
	}

	.messy-shell,
	.clean-shell {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		left: 1rem;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--background);
	}

	.messy-shell {
		top: 3.5rem;
		padding: 0.85rem;
	}

	.messy-hero,
	.messy-footer,
	.messy-grid span,
	.clean-header,
	.clean-metrics span,
	.clean-list span,
	.clean-sidebar span {
		border-radius: 0.65rem;
		background: color-mix(in oklch, var(--foreground) 10%, transparent);
	}

	.messy-hero {
		height: 5rem;
	}

	.messy-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.55rem;
		margin-top: 0.7rem;
	}

	.messy-grid span {
		height: 4.2rem;
	}

	.messy-grid span:nth-child(2),
	.messy-grid span:nth-child(5) {
		transform: translateY(1rem);
	}

	.messy-footer {
		height: 3.75rem;
		margin-top: 1.6rem;
	}

	.clean-shell {
		top: 3.5rem;
		display: grid;
		grid-template-columns: 9rem 1fr;
	}

	.clean-sidebar {
		display: grid;
		align-content: start;
		gap: 0.6rem;
		border-right: 1px solid var(--border);
		background: color-mix(in oklch, var(--muted) 48%, transparent);
		padding: 0.85rem;
	}

	.clean-sidebar span {
		height: 2.35rem;
	}

	.clean-sidebar span:first-child {
		background: var(--background);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.clean-main {
		padding: 0.85rem;
	}

	.clean-header {
		height: 4.25rem;
		background: color-mix(in oklch, var(--primary) 9%, var(--background));
	}

	.clean-metrics {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem;
		margin-top: 0.7rem;
	}

	.clean-metrics span {
		height: 3.4rem;
		background: var(--card);
		border: 1px solid var(--border);
	}

	.clean-list {
		display: grid;
		gap: 0.55rem;
		margin-top: 0.7rem;
	}

	.clean-list span {
		height: 2.8rem;
		background: var(--card);
		border: 1px solid var(--border);
	}

	.option-lanes {
		display: grid;
		gap: 1rem;
	}

	.option-lane {
		display: grid;
		gap: 1.1rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		padding: 1.1rem;
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.option-lane-highlight {
		border-color: color-mix(in oklch, var(--primary) 30%, var(--border));
		box-shadow:
			0 0 0 1px color-mix(in oklch, var(--primary) 8%, transparent),
			0 18px 40px color-mix(in oklch, var(--foreground) 8%, transparent);
	}

	.option-head h3 {
		margin-top: 0.8rem;
		font-size: 1.25rem;
		font-weight: 650;
	}

	.option-head p,
	.option-outcome {
		margin-top: 0.45rem;
		color: var(--muted-foreground);
		line-height: 1.6;
	}

	.option-lane ul {
		display: grid;
		gap: 0.65rem;
	}

	.option-lane li {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		font-size: 0.92rem;
	}

	.option-lane li span {
		display: flex;
		width: 1.75rem;
		height: 1.75rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--muted);
	}

	.option-lane li .included {
		color: var(--foreground);
	}

	.option-lane li .missing {
		color: var(--muted-foreground);
	}

	.option-outcome {
		border-top: 1px solid var(--border);
		padding-top: 1rem;
		font-weight: 650;
		color: var(--foreground);
	}

	@media (min-width: 840px) {
		.option-lanes {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.compare-after,
		.compare-divider {
			transition: none;
		}
	}
</style>
