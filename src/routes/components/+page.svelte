<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { resolve } from '$app/paths';
	import AppLogo from '$lib/components/app-logo.svelte';
	import LandingNav from '$lib/components/landing/landing-nav.svelte';
	import LandingFooter from '$lib/components/landing/landing-footer.svelte';
	import { Button } from '$lib/components/ui/button';
	import { APP_DESCRIPTION, APP_NAME } from '$lib/constants';
	import { categories } from './registry';

	const to = {
		home: resolve('/'),
		signUp: resolve('/auth/sign-up'),
		demo: resolve('/auth/demo')
	};
</script>

<svelte:head>
	<title>Components | {APP_NAME}</title>
	<meta name="description" content={APP_DESCRIPTION} />
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
		<section class="py-20 sm:py-24">
			<div class="mx-auto max-w-7xl px-6">
				<div class="max-w-2xl">
					<a href={resolve('/')} class="flex items-center gap-3 font-semibold tracking-tight">
						<AppLogo class="size-7 rounded-lg" />
						<span>{APP_NAME}</span>
					</a>
					<h1 class="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
						Landing components
					</h1>
					<p class="mt-4 text-base leading-7 text-muted-foreground">
						Source-owned Svelte sections in <code class="rounded bg-muted px-1.5 py-0.5 text-sm"
							>src/lib/components/landing</code
						>. Browse a category to see every variant with dummy data.
					</p>
					<div class="mt-6 flex flex-wrap gap-3">
						<Button href={to.demo} size="lg">
							Use demo account
							<ArrowRightIcon data-icon="inline-end" />
						</Button>
						<Button href={to.signUp} variant="outline" size="lg">Create account</Button>
					</div>
				</div>

				<div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each categories as category (category.id)}
						<a href={resolve(`/components/${category.id}`)} class="category-card">
							<div class="category-card-top">
								<span class="category-index">{category.title}</span>
								<ArrowRightIcon class="size-4 transition-transform" />
							</div>
							<p class="category-blurb">{category.blurb}</p>
							<p class="category-count">
								{category.components.length} variant{category.components.length === 1 ? '' : 's'}
							</p>
						</a>
					{/each}
				</div>
			</div>
		</section>
	</main>

	<LandingFooter />
</div>

<style>
	.category-card {
		display: grid;
		gap: 0.6rem;
		content-visibility: auto;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		padding: 1.5rem;
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
		transition:
			border-color 140ms ease,
			box-shadow 140ms ease;
	}

	.category-card:hover {
		border-color: color-mix(in oklch, var(--foreground) 22%, transparent);
		box-shadow: 0 8px 24px color-mix(in oklch, var(--foreground) 8%, transparent);
	}

	.category-card:hover :global([data-icon='inline-end']) {
		transform: translateX(2px);
	}

	.category-card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.category-index {
		font-weight: 650;
	}

	.category-blurb {
		color: var(--muted-foreground);
		font-size: 0.92rem;
		line-height: 1.6;
	}

	.category-count {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--muted-foreground);
	}
</style>
