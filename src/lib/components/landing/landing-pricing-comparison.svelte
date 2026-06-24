<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { Badge } from '$lib/components/ui/badge';

	interface Tier {
		name: string;
		price: string;
		note: string;
		featured?: boolean;
	}

	interface FeatureGroup {
		name: string;
		rows: readonly {
			label: string;
			values: readonly (boolean | string)[];
		}[];
	}

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		tiers?: readonly Tier[];
		groups?: readonly FeatureGroup[];
	}

	let {
		kicker = 'Pricing comparison',
		title = 'A compact matrix for the details people check before checkout.',
		description = 'Use this under card pricing when your plans differ by usage, integrations, support, or launch services.',
		tiers = [
			{ name: 'Starter', price: '$19', note: 'One product launch' },
			{ name: 'Launch', price: '$49', note: 'Best for paid beta', featured: true },
			{ name: 'Scale', price: '$129', note: 'Team launch system' }
		],
		groups = [
			{
				name: 'Landing system',
				rows: [
					{ label: 'Hero and CTA variants', values: ['4', '8', 'Custom'] },
					{ label: 'Feature bento blocks', values: [true, true, true] },
					{
						label: 'Proof wall variants',
						values: ['Basic', 'Mosaic + marquee', 'Custom proof library']
					}
				]
			},
			{
				name: 'Product plumbing',
				rows: [
					{ label: 'Auth-ready app shell', values: [true, true, true] },
					{ label: 'Billing copy patterns', values: [false, true, true] },
					{ label: 'Team onboarding flows', values: [false, false, true] }
				]
			},
			{
				name: 'Launch support',
				rows: [
					{ label: 'Founder checklist', values: [true, true, true] },
					{ label: 'Review-ready comparison page', values: [false, true, true] },
					{ label: 'Priority implementation notes', values: [false, false, true] }
				]
			}
		]
	}: Props = $props();

	function valueLabel(value: boolean | string) {
		if (value === true) return 'Included';
		if (value === false) return 'Not included';
		return value;
	}
</script>

<section class="border-y bg-muted/30 py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
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

		<div class="pricing-matrix mt-12">
			<div class="matrix-head">
				<div></div>
				{#each tiers as tier (tier.name)}
					<div class={tier.featured ? 'tier-featured' : ''}>
						<span>{tier.name}</span>
						<strong>{tier.price}</strong>
						<small>{tier.note}</small>
					</div>
				{/each}
			</div>

			{#each groups as group (group.name)}
				<div class="matrix-group">
					<h3>{group.name}</h3>
					{#each group.rows as row (row.label)}
						<div class="matrix-row">
							<p>{row.label}</p>
							{#each row.values as value, index (`${row.label}-${index}`)}
								<div class={tiers[index]?.featured ? 'tier-featured' : ''}>
									{#if value === true}
										<CheckIcon class="size-4" aria-label={valueLabel(value)} />
									{:else if value === false}
										<MinusIcon
											class="size-4 text-muted-foreground"
											aria-label={valueLabel(value)}
										/>
									{:else}
										<span>{value}</span>
									{/if}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.pricing-matrix {
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.matrix-head,
	.matrix-row {
		display: grid;
		grid-template-columns: minmax(12rem, 1.15fr) repeat(3, minmax(9rem, 1fr));
		min-width: 54rem;
	}

	.matrix-head {
		background: color-mix(in oklch, var(--muted) 46%, transparent);
	}

	.matrix-head > div,
	.matrix-row > p,
	.matrix-row > div {
		padding: 1rem;
	}

	.matrix-head > div:not(:first-child) {
		display: grid;
		gap: 0.2rem;
		border-left: 1px solid var(--border);
	}

	.matrix-head span {
		font-size: 0.9rem;
		font-weight: 700;
	}

	.matrix-head strong {
		font-size: 1.8rem;
		font-weight: 700;
		letter-spacing: 0;
	}

	.matrix-head small {
		color: var(--muted-foreground);
		font-size: 0.78rem;
	}

	.matrix-group {
		min-width: 54rem;
		border-top: 1px solid var(--border);
	}

	.matrix-group h3 {
		background: var(--background);
		padding: 0.85rem 1rem;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	.matrix-row {
		border-top: 1px solid var(--border);
	}

	.matrix-row p {
		color: var(--muted-foreground);
		line-height: 1.5;
	}

	.matrix-row > div {
		display: flex;
		align-items: center;
		border-left: 1px solid var(--border);
		font-size: 0.92rem;
		font-weight: 650;
	}

	.matrix-row :global(svg) {
		color: var(--foreground);
	}

	.tier-featured {
		background: color-mix(in oklch, var(--primary) 6%, transparent);
	}

	@media (max-width: 760px) {
		.pricing-matrix {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
		}
	}
</style>
