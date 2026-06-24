<script lang="ts">
	import PlayIcon from '@lucide/svelte/icons/play';
	import XIcon from '@lucide/svelte/icons/x';
	import { Badge } from '$lib/components/ui/badge';

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		videoSrc?: string;
		thumbnailSrc?: string;
		thumbnailAlt?: string;
	}

	let {
		kicker = 'Hero video dialog',
		title = 'A video opener for product tours.',
		description = 'Thumbnail first, focused overlay second.',
		videoSrc = 'https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb',
		thumbnailSrc = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
		thumbnailAlt = 'Product dashboard video thumbnail'
	}: Props = $props();

	let open = $state(false);

	function close() {
		open = false;
	}

	function handleModalClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close();
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			close();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<section class="py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
			<div>
				<Badge variant="outline">{kicker}</Badge>
				<h2 class="mt-5 max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
					{title}
				</h2>
				<p class="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{description}</p>
			</div>

			<button
				type="button"
				class="video-trigger group"
				aria-label="Play product video"
				onclick={() => (open = true)}
			>
				<img src={thumbnailSrc} alt={thumbnailAlt} loading="lazy" decoding="async" />
				<span class="video-surface" aria-hidden="true">
					<span class="video-play-ring">
						<span class="video-play">
							<PlayIcon class="size-8 fill-current" />
						</span>
					</span>
				</span>
			</button>
		</div>
	</div>
</section>

{#if open}
	<div class="video-modal" role="presentation" onclick={handleModalClick}>
		<div class="video-dialog" role="dialog" aria-modal="true" aria-label="Product video">
			<button type="button" class="video-close" aria-label="Close video" onclick={close}>
				<XIcon class="size-5" />
			</button>
			<iframe
				src={videoSrc}
				title="Product video"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	</div>
{/if}

<style>
	.video-trigger {
		position: relative;
		display: block;
		overflow: hidden;
		width: 100%;
		border: 1px solid var(--border);
		border-radius: 1.25rem;
		background: var(--muted);
		padding: 0;
		box-shadow:
			0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent),
			0 24px 70px color-mix(in oklch, var(--foreground) 9%, transparent);
		cursor: pointer;
	}

	.video-trigger img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		transition:
			filter 180ms ease,
			transform 240ms ease;
	}

	.video-trigger:hover img {
		filter: brightness(0.78);
		transform: scale(1.015);
	}

	.video-surface {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.video-play-ring {
		display: grid;
		width: clamp(5.5rem, 11vw, 7rem);
		height: clamp(5.5rem, 11vw, 7rem);
		place-items: center;
		border-radius: 999px;
		background: color-mix(in oklch, var(--background) 20%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		transition: transform 180ms ease;
	}

	.video-trigger:hover .video-play-ring {
		transform: scale(1.04);
	}

	.video-play {
		display: grid;
		width: 4.4rem;
		height: 4.4rem;
		place-items: center;
		border-radius: 999px;
		background: linear-gradient(
			to bottom,
			color-mix(in oklch, var(--primary) 70%, white),
			var(--primary)
		);
		color: var(--primary-foreground);
		box-shadow: 0 14px 28px color-mix(in oklch, var(--foreground) 22%, transparent);
	}

	.video-modal {
		position: fixed;
		z-index: 220;
		inset: 0;
		display: grid;
		place-items: center;
		background: color-mix(in oklch, black 58%, transparent);
		padding: 1rem;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		animation: video-modal-in 140ms ease both;
	}

	.video-dialog {
		position: relative;
		width: min(66rem, 100%);
		aspect-ratio: 16 / 9;
		border: 1px solid color-mix(in oklch, white 30%, transparent);
		border-radius: 1.25rem;
		background: black;
		box-shadow: 0 28px 90px color-mix(in oklch, black 34%, transparent);
		animation: video-dialog-in 180ms ease both;
	}

	.video-dialog iframe {
		width: 100%;
		height: 100%;
		border: 0;
		border-radius: inherit;
	}

	.video-close {
		position: absolute;
		top: -3.1rem;
		right: 0;
		display: grid;
		width: 2.4rem;
		height: 2.4rem;
		place-items: center;
		border: 1px solid color-mix(in oklch, white 20%, transparent);
		border-radius: 999px;
		background: color-mix(in oklch, black 42%, transparent);
		color: white;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	@keyframes video-modal-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes video-dialog-in {
		from {
			opacity: 0;
			transform: translateY(1rem) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.video-trigger img,
		.video-play-ring,
		.video-modal,
		.video-dialog {
			animation: none;
			transition: none;
		}
	}
</style>
