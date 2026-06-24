<script lang="ts">
	import { LayoutGroup, MotionConfig, motion } from '@humanspeak/svelte-motion';
	import BotIcon from '@lucide/svelte/icons/bot';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import DatabaseZapIcon from '@lucide/svelte/icons/database-zap';
	import LockKeyholeIcon from '@lucide/svelte/icons/lock-keyhole';
	import type { Component } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';

	interface TabItem {
		value: string;
		label: string;
		title: string;
		description: string;
		icon: Component;
		rows: readonly string[];
	}

	interface Props {
		tabs?: readonly TabItem[];
	}

	let {
		tabs = [
			{
				value: 'auth',
				label: 'Auth',
				title: 'Accounts without a blank auth page',
				description: 'Sign-up, recovery, sessions, and protected layouts as one story.',
				icon: LockKeyholeIcon,
				rows: ['OAuth and email/password', 'Profile completion routing', 'Session-aware app shell']
			},
			{
				value: 'data',
				label: 'Data',
				title: 'Realtime data has a landing section',
				description: 'Convex queries paired with concrete UI states.',
				icon: DatabaseZapIcon,
				rows: ['Typed Convex boundaries', 'Live tables and charts', 'Upload and storage states']
			},
			{
				value: 'billing',
				label: 'Billing',
				title: 'Pricing matches the billing model',
				description: 'Plans, checkout, portal, and limits in one narrative.',
				icon: CreditCardIcon,
				rows: ['Plan cards', 'Usage limits', 'Upgrade and portal calls']
			},
			{
				value: 'ai',
				label: 'AI',
				title: 'AI features framed like product',
				description: 'Assistant previews and tool rows without sparkle copy.',
				icon: BotIcon,
				rows: ['Streaming response layout', 'Tool result cards', 'Model selector ready']
			}
		]
	}: Props = $props();

	let selectedValue = $state<string | null>(null);
	const activeValue = $derived(selectedValue ?? tabs[0]?.value ?? '');
	const activeTab = $derived(tabs.find((tab) => tab.value === activeValue) ?? tabs[0]);
	const activeRows = $derived(activeTab?.rows ?? []);
	const reduceMotion = $derived(prefersReducedMotion.current);
	const tabTransition = $derived(
		reduceMotion
			? { duration: 0 }
			: { type: 'spring' as const, stiffness: 560, damping: 42, mass: 0.42 }
	);
</script>

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6">
		{#if activeTab}
			<MotionConfig transition={tabTransition}>
				<LayoutGroup id="landing-feature-tabs">
					<div class="grid gap-6 lg:grid-cols-[15rem_1fr]">
						<div
							role="tablist"
							aria-label="Feature examples"
							class="inline-flex h-fit flex-wrap items-center gap-1 rounded-xl border bg-card p-1 lg:grid lg:w-full"
						>
							{#each tabs as tab (tab.value)}
								<div class="relative">
									{#if activeValue === tab.value}
										<motion.span
											layoutId="landing-feature-active-tab"
											class="absolute inset-0 rounded-lg bg-primary"
										></motion.span>
									{/if}
									<button
										type="button"
										role="tab"
										aria-selected={activeValue === tab.value}
										aria-controls={`landing-tabpanel-${tab.value}`}
										id={`landing-tab-${tab.value}`}
										class={[
											'relative z-10 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-transparent px-4 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
											activeValue === tab.value
												? 'text-primary-foreground'
												: 'text-muted-foreground hover:text-foreground'
										].join(' ')}
										onclick={() => (selectedValue = tab.value)}
									>
										<tab.icon class="size-4" />
										<span>{tab.label}</span>
									</button>
								</div>
							{/each}
						</div>

						<div
							id={`landing-tabpanel-${activeTab.value}`}
							role="tabpanel"
							aria-labelledby={`landing-tab-${activeTab.value}`}
							class="feature-panel"
						>
							<div class="feature-eyebrow">
								<span class="feature-icon">
									<activeTab.icon class="size-5" />
								</span>
								<div class="feature-title">
									<h3>{activeTab.title}</h3>
									<p>{activeTab.description}</p>
								</div>
							</div>
							<div class="feature-checklist">
								{#each activeRows as row (row)}
									<div>
										<span></span>
										{row}
									</div>
								{/each}
							</div>
						</div>
					</div>
				</LayoutGroup>
			</MotionConfig>
		{/if}
	</div>
</section>

<style>
	.feature-panel {
		display: grid;
		align-content: start;
		gap: 1.5rem;
		min-height: 14rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
		padding: 1.5rem;
	}

	.feature-eyebrow {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.feature-icon {
		display: inline-flex;
		width: 2.5rem;
		height: 2.5rem;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--muted);
		color: var(--foreground);
	}

	.feature-title h3 {
		font-size: clamp(1.3rem, 2.2vw, 1.75rem);
		font-weight: 650;
		line-height: 1.1;
		letter-spacing: -0.01em;
		text-wrap: balance;
	}

	.feature-title p {
		margin-top: 0.5rem;
		max-width: 42rem;
		color: var(--muted-foreground);
		font-size: 1rem;
		line-height: 1.65;
	}

	.feature-checklist {
		display: grid;
		gap: 0.65rem;
	}

	.feature-checklist div {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		color: var(--foreground);
		font-size: 0.92rem;
	}

	.feature-checklist span {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 999px;
		background: var(--primary);
	}
</style>
