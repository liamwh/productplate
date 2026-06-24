<script lang="ts">
	import {
		LandingAppleCardsCarousel,
		LandingBentoFeatures,
		LandingComparisonTable,
		LandingFaqSection,
		LandingFeatureTabs,
		LandingFinalCta,
		LandingFooter,
		LandingHero,
		LandingHeroVideoDialog,
		LandingIntegrationCloud,
		LandingLensShowcase,
		LandingLogoMarquee,
		LandingNav,
		LandingOrbitingCircles,
		LandingPricingCards,
		LandingPricingComparison,
		LandingProcessTimeline,
		LandingStatsStrip,
		LandingStickyScrollReveal,
		LandingTestimonialMarquee,
		LandingTestimonialWall,
		LandingThreeDMarquee
	} from '$lib/components/landing';
	import { APP_NAME } from '$lib/constants';
</script>

<svelte:head>
	<title>Landing Components | {APP_NAME}</title>
	<meta
		name="description"
		content="A gallery of reusable Svelte landing page components from src/lib/components/landing."
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
		<LandingHero />
		<LandingLogoMarquee />
		<LandingStatsStrip />

		<section class="group" aria-label="Feature systems">
			<div class="group-label"><span>Features</span></div>
			<LandingBentoFeatures />
			<LandingFeatureTabs />
			<LandingComparisonTable />
			<LandingProcessTimeline />
			<LandingOrbitingCircles />
		</section>

		<section class="group" aria-label="Proof and social signals">
			<div class="group-label"><span>Proof</span></div>
			<LandingTestimonialWall />
			<LandingTestimonialMarquee />
			<LandingHeroVideoDialog />
			<LandingAppleCardsCarousel />
		</section>

		<section class="group" aria-label="Pricing and FAQ">
			<div class="group-label"><span>Pricing &amp; FAQ</span></div>
			<LandingPricingCards />
			<LandingPricingComparison />
			<LandingFaqSection />
		</section>

		<section class="group" aria-label="Showcase patterns">
			<div class="group-label"><span>Showcase</span></div>
			<LandingStickyScrollReveal />
			<LandingLensShowcase />
			<LandingIntegrationCloud />
			<LandingThreeDMarquee />
		</section>

		<LandingFinalCta />
	</main>

	<LandingFooter />
</div>

<style>
	.group {
		display: block;
	}

	.group-label {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0 max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem));
		margin-top: 2.5rem;
	}

	.group-label span {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		white-space: nowrap;
	}

	.group-label::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--border);
	}
</style>
