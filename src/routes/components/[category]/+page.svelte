<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import LandingNav from '$lib/components/landing/landing-nav.svelte';
	import LandingFooter from '$lib/components/landing/landing-footer.svelte';
	import { categories, getCategory } from '../registry';

	let current = $derived(getCategory(page.params.category ?? ''));
</script>

<svelte:head>
	<title>{current ? `${current.title} components` : 'Components'} | Product Plate</title>
	<meta
		name="description"
		content={current ? current.blurb : 'Browse landing page component variants for Product Plate.'}
	/>
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow-lg"
>
	Skip to content
</a>

<div class="min-h-screen bg-background text-foreground">
	<LandingNav />

	<main id="main-content">
		{#if current}
			<section class="border-b">
				<div class="mx-auto max-w-7xl px-6 py-10">
					<nav class="category-nav" aria-label="Component categories">
						{#each categories as category (category.id)}
							<a
								href={resolve(`/components/${category.id}`)}
								class="category-tab"
								class:category-tab-active={category.id === current.id}
								aria-current={category.id === current.id ? 'page' : undefined}
							>
								{category.title}
							</a>
						{/each}
					</nav>

					<div class="mt-8 max-w-2xl">
						<h1 class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
							{current.title} components
						</h1>
						<p class="mt-3 text-base leading-7 text-muted-foreground">{current.blurb}</p>
					</div>
				</div>
			</section>

			{#each current.components as entry (entry.key)}
				{@const Component = entry.Component}
				<section class="variant" aria-label={entry.label}>
					<div class="variant-label"><span>{entry.label}</span></div>
					<Component />
				</section>
			{/each}
		{:else}
			<section class="py-32">
				<div class="mx-auto max-w-2xl px-6 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Category not found</h1>
					<p class="mt-3 text-muted-foreground">
						That category does not exist. Pick one from the index.
					</p>
					<a
						href={resolve('/components')}
						class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
					>
						Back to components
					</a>
				</div>
			</section>
		{/if}
	</main>

	<LandingFooter />
</div>

<style>
	.category-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.category-tab {
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--card);
		padding: 0.4rem 0.9rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--muted-foreground);
		transition:
			color 140ms ease,
			border-color 140ms ease,
			background-color 140ms ease;
	}

	.category-tab:hover {
		color: var(--foreground);
		border-color: color-mix(in oklch, var(--foreground) 22%, transparent);
	}

	.category-tab-active {
		color: var(--primary-foreground);
		background: var(--primary);
		border-color: var(--primary);
	}

	.variant {
		display: block;
	}

	.variant-label {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0 max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem));
		margin-top: 2.5rem;
	}

	.variant-label span {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		white-space: nowrap;
	}

	.variant-label::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--border);
	}
</style>
