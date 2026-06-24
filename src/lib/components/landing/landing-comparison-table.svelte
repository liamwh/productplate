<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	type SlideMode = 'hover' | 'drag';

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
		firstImage?: string;
		secondImage?: string;
		firstImageAlt?: string;
		secondImageAlt?: string;
		initialSliderPercentage?: number;
		slideMode?: SlideMode;
		showHandlebar?: boolean;
		options?: readonly Option[];
	}

	let {
		kicker = 'Comparison',
		title = 'Let visitors scrub the before and after instead of reading a spreadsheet.',
		description = 'Ported from Aceternity’s Compare component: a clipped image layer, pointer-driven slider, drag or hover modes, and compact option lanes for the actual buying decision.',
		firstImage = 'https://assets.aceternity.com/code-problem.png',
		secondImage = 'https://assets.aceternity.com/code-solution.png',
		firstImageAlt = 'Before screenshot with messy implementation details',
		secondImageAlt = 'After screenshot with cleaner implementation details',
		initialSliderPercentage = 54,
		slideMode = 'drag',
		showHandlebar = true,
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

	let sliderRef: HTMLDivElement | undefined = $state();
	let sliderXPercent = $state(getInitialSliderPercentage());
	let isDragging = $state(false);

	const scrubLabel = $derived(
		slideMode === 'drag' ? 'Drag the handle to compare' : 'Move across the image to compare'
	);

	function clampPercentage(value: number) {
		return Math.max(0, Math.min(100, value));
	}

	function getInitialSliderPercentage() {
		return initialSliderPercentage;
	}

	function updateSlider(clientX: number) {
		if (!sliderRef) return;

		const rect = sliderRef.getBoundingClientRect();
		const nextPercent = ((clientX - rect.left) / rect.width) * 100;
		sliderXPercent = clampPercentage(nextPercent);
	}

	function handlePointerDown(event: PointerEvent) {
		if (slideMode === 'drag') {
			isDragging = true;
			(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		}

		updateSlider(event.clientX);
	}

	function handlePointerMove(event: PointerEvent) {
		if (slideMode === 'hover' || isDragging) {
			updateSlider(event.clientX);
		}
	}

	function handlePointerUp(event: PointerEvent) {
		isDragging = false;
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
	}

	function handlePointerLeave() {
		isDragging = false;

		if (slideMode === 'hover') {
			sliderXPercent = getInitialSliderPercentage();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			sliderXPercent = clampPercentage(sliderXPercent - 4);
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			sliderXPercent = clampPercentage(sliderXPercent + 4);
		}
	}
</script>

<section class="py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
			<div>
				<Badge variant="outline">{kicker}</Badge>
				<h2 class="mt-5 max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
					{title}
				</h2>
				<p class="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{description}</p>
				<Button href="#pricing" variant="outline" class="mt-8">
					Compare plans
					<ArrowRightIcon data-icon="inline-end" />
				</Button>
			</div>

			<div class="grid gap-5">
				<div class="compare-shell">
					<div class="compare-heading">
						<span>Before</span>
						<span>{scrubLabel}</span>
						<span>After</span>
					</div>

					<div
						bind:this={sliderRef}
						class={['compare-frame', isDragging ? 'is-dragging' : ''].filter(Boolean).join(' ')}
						role="slider"
						tabindex="0"
						aria-label="Before and after product comparison"
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={Math.round(sliderXPercent)}
						onpointerdown={handlePointerDown}
						onpointermove={handlePointerMove}
						onpointerup={handlePointerUp}
						onpointercancel={handlePointerUp}
						onpointerleave={handlePointerLeave}
						onkeydown={handleKeydown}
					>
						<img
							class="compare-image compare-image-after"
							src={secondImage}
							alt={secondImageAlt}
							draggable="false"
							loading="lazy"
							decoding="async"
						/>
						<div
							class="compare-image-before"
							style={`clip-path: inset(0 ${100 - sliderXPercent}% 0 0);`}
						>
							<img
								class="compare-image"
								src={firstImage}
								alt={firstImageAlt}
								draggable="false"
								loading="lazy"
								decoding="async"
							/>
						</div>

						<div class="compare-divider" style={`left: ${sliderXPercent}%;`} aria-hidden="true">
							<span class="compare-glow compare-glow-wide"></span>
							<span class="compare-glow compare-glow-tight"></span>
							{#if showHandlebar}
								<span class="compare-handle">
									<GripVerticalIcon class="size-4" />
								</span>
							{/if}
						</div>
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
	.compare-shell {
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 1.25rem;
		background: color-mix(in oklch, var(--muted) 48%, var(--background));
		padding: 0.75rem;
		box-shadow:
			0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent),
			0 24px 60px color-mix(in oklch, var(--foreground) 8%, transparent);
	}

	.compare-heading {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 0.75rem;
		padding: 0.2rem 0.25rem 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	.compare-heading span:nth-child(2) {
		text-align: center;
		text-transform: none;
	}

	.compare-heading span:last-child {
		text-align: right;
	}

	.compare-frame {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		height: clamp(20rem, 52vw, 35rem);
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--background);
		cursor: grab;
		touch-action: none;
		outline: none;
		user-select: none;
	}

	.compare-frame:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 28%, transparent);
	}

	.compare-frame.is-dragging {
		cursor: grabbing;
	}

	.compare-image,
	.compare-image-before {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.compare-image {
		object-fit: cover;
		object-position: left top;
		pointer-events: none;
	}

	.compare-image-after {
		z-index: 1;
	}

	.compare-image-before {
		z-index: 2;
		overflow: hidden;
		border-radius: inherit;
		will-change: clip-path;
	}

	.compare-divider {
		position: absolute;
		z-index: 4;
		top: 0;
		bottom: 0;
		width: 1px;
		background: linear-gradient(to bottom, transparent 4%, var(--primary) 50%, transparent 96%);
		transform: translateX(-0.5px);
	}

	.compare-glow {
		position: absolute;
		top: 50%;
		left: 0;
		pointer-events: none;
		transform: translateY(-50%);
	}

	.compare-glow-wide {
		width: 9rem;
		height: 100%;
		background: linear-gradient(
			to right,
			color-mix(in oklch, var(--primary) 28%, transparent),
			transparent
		);
		mask-image: radial-gradient(110px at left, black, transparent);
		-webkit-mask-image: radial-gradient(110px at left, black, transparent);
		opacity: 0.55;
	}

	.compare-glow-tight {
		width: 2.5rem;
		height: 64%;
		background: linear-gradient(
			to right,
			color-mix(in oklch, var(--foreground) 22%, transparent),
			transparent
		);
		mask-image: radial-gradient(60px at left, black, transparent);
		-webkit-mask-image: radial-gradient(60px at left, black, transparent);
	}

	.compare-handle {
		position: absolute;
		top: 50%;
		right: -1rem;
		display: inline-flex;
		width: 2rem;
		height: 2rem;
		align-items: center;
		justify-content: center;
		border: 1px solid color-mix(in oklch, var(--border) 74%, var(--background));
		border-radius: 0.65rem;
		background: color-mix(in oklch, var(--background) 96%, transparent);
		color: var(--foreground);
		box-shadow:
			0 0 0 1px color-mix(in oklch, var(--foreground) 5%, transparent),
			0 12px 24px color-mix(in oklch, var(--foreground) 18%, transparent);
		transform: translateY(-50%);
	}

	.option-lanes {
		display: grid;
		gap: 0.75rem;
	}

	.option-lane {
		display: grid;
		gap: 1rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		padding: 1rem;
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 4%, transparent);
	}

	.option-lane-highlight {
		border-color: color-mix(in oklch, var(--primary) 38%, var(--border));
		background: color-mix(in oklch, var(--primary) 6%, var(--card));
	}

	.option-head h3 {
		margin-top: 0.75rem;
		font-size: 1.15rem;
		font-weight: 650;
		letter-spacing: 0;
	}

	.option-head p {
		margin-top: 0.45rem;
		color: var(--muted-foreground);
		line-height: 1.65;
	}

	.option-lane ul {
		display: grid;
		gap: 0.65rem;
	}

	.option-lane li {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		color: var(--muted-foreground);
		font-size: 0.9rem;
	}

	.included,
	.missing {
		display: inline-flex;
		width: 1.35rem;
		height: 1.35rem;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
	}

	.included {
		background: color-mix(in oklch, var(--primary) 12%, transparent);
		color: var(--foreground);
	}

	.missing {
		background: color-mix(in oklch, var(--foreground) 7%, transparent);
		color: var(--muted-foreground);
	}

	.option-outcome {
		width: fit-content;
		border-radius: 999px;
		background: var(--muted);
		padding: 0.32rem 0.65rem;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	@media (min-width: 760px) {
		.option-lane {
			grid-template-columns: 0.95fr 1.05fr auto;
			align-items: center;
		}

		.option-outcome {
			justify-self: end;
			white-space: nowrap;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.compare-frame,
		.compare-image-before {
			scroll-behavior: auto;
		}
	}
</style>
