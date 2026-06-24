<script lang="ts">
	import { LayoutGroup, MotionConfig, motion } from '@humanspeak/svelte-motion';
	import BotIcon from '@lucide/svelte/icons/bot';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import DatabaseZapIcon from '@lucide/svelte/icons/database-zap';
	import LockKeyholeIcon from '@lucide/svelte/icons/lock-keyhole';
	import type { Component } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Badge } from '$lib/components/ui/badge';

	interface TabItem {
		value: string;
		label: string;
		title: string;
		description: string;
		icon: Component;
		rows: readonly string[];
		sidebar: readonly string[];
		route: string;
		metric: string;
		metricLabel: string;
		note: string;
	}

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		tabs?: readonly TabItem[];
	}

	let {
		kicker = 'Feature tabs',
		title = 'A classic product section, tightened for repeat scanning.',
		description = 'A Svelte transfer of beUI’s shared-layout tab idea: the indicator moves because it helps orientation, while the product mock stays composed.',
		tabs = [
			{
				value: 'auth',
				label: 'Auth',
				title: 'Account flows without a blank auth page',
				description:
					'Show sign-up, recovery, sessions, protected layouts, and profile state as one complete product story.',
				icon: LockKeyholeIcon,
				rows: ['OAuth and email/password', 'Profile completion routing', 'Session-aware app shell'],
				sidebar: ['Sign in', 'Onboarding', 'Dashboard', 'Settings'],
				route: '/auth/onboarding',
				metric: '3 flows',
				metricLabel: 'ready to wire',
				note: 'Protected layouts and public routes share the same visual language.'
			},
			{
				value: 'data',
				label: 'Data',
				title: 'Realtime data gets a landing section too',
				description:
					'Pair Convex queries with concrete UI states, so visitors can see how the app changes once data arrives.',
				icon: DatabaseZapIcon,
				rows: ['Typed Convex boundaries', 'Live tables and charts', 'Upload and storage states'],
				sidebar: ['Queries', 'Mutations', 'Files', 'Events'],
				route: '/dashboard/activity',
				metric: '24ms',
				metricLabel: 'mock sync',
				note: 'Use this panel for a dashboard screenshot, live chart, or app-state walkthrough.'
			},
			{
				value: 'billing',
				label: 'Billing',
				title: 'Pricing copy can match the actual billing model',
				description:
					'Connect plans, checkout state, portal actions, and customer limits in one consistent narrative.',
				icon: CreditCardIcon,
				rows: ['Plan cards', 'Usage limits', 'Upgrade and portal calls'],
				sidebar: ['Plans', 'Checkout', 'Portal', 'Invoices'],
				route: '/settings/billing',
				metric: '$49',
				metricLabel: 'starter plan',
				note: 'Show limits and upgrade moments before visitors ever hit checkout.'
			},
			{
				value: 'ai',
				label: 'AI',
				title: 'AI features deserve product-grade framing',
				description:
					'Use assistant previews, tool rows, and reasoning states without making the page feel like a generic AI site.',
				icon: BotIcon,
				rows: ['Streaming response layout', 'Tool result cards', 'Model selector ready'],
				sidebar: ['Assistant', 'Tools', 'History', 'Settings'],
				route: '/assistant/new',
				metric: '4 tools',
				metricLabel: 'shown cleanly',
				note: 'Keep AI sections specific to product work instead of abstract sparkle copy.'
			}
		]
	}: Props = $props();

	let selectedValue = $state<string | null>(null);
	const activeValue = $derived(selectedValue ?? tabs[0]?.value ?? '');
	const activeTab = $derived(tabs.find((tab) => tab.value === activeValue) ?? tabs[0]);
	const activeRows = $derived(activeTab?.rows ?? []);
	const activeSidebar = $derived(activeTab?.sidebar ?? []);
	const reduceMotion = $derived(prefersReducedMotion.current);
	const tabTransition = $derived(
		reduceMotion
			? { duration: 0 }
			: { type: 'spring' as const, stiffness: 360, damping: 34, mass: 0.65 }
	);
</script>

<section class="py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
			<div>
				<Badge variant="outline">{kicker}</Badge>
				<h2 class="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
					{title}
				</h2>
			</div>
			<p class="max-w-2xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
				{description}
			</p>
		</div>

		{#if activeTab}
			<MotionConfig transition={tabTransition}>
				<LayoutGroup id="landing-feature-tabs">
					<div class="mt-12 grid gap-6 lg:grid-cols-[17rem_1fr]">
						<div
							role="tablist"
							aria-label="Landing component feature examples"
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
							<div class="feature-copy">
								<div class="feature-eyebrow">
									<span class="feature-icon">
										<activeTab.icon class="size-5" />
									</span>
									<span>{activeTab.route}</span>
								</div>
								<h3>{activeTab.title}</h3>
								<p>{activeTab.description}</p>
								<div class="feature-checklist">
									{#each activeRows as row (row)}
										<div>
											<span></span>
											{row}
										</div>
									{/each}
								</div>
							</div>

							<div class="product-shell" aria-label={`${activeTab.label} product preview`}>
								<div class="product-chrome">
									<div aria-hidden="true">
										<span></span>
										<span></span>
										<span></span>
									</div>
									<p>{activeTab.route}</p>
									<Badge variant="secondary">Example</Badge>
								</div>
								<div class="product-body">
									<aside class="product-sidebar" aria-label="Preview navigation">
										{#each activeSidebar as item, index (item)}
											<span
												class={['sidebar-item', index === 0 ? 'sidebar-item-active' : '']
													.filter(Boolean)
													.join(' ')}
											>
												<span></span>
												{item}
											</span>
										{/each}
									</aside>

									<div class="product-main">
										<div class="metric-row">
											<div>
												<p>{activeTab.metricLabel}</p>
												<strong>{activeTab.metric}</strong>
											</div>
											<div>
												<p>surface</p>
												<strong>{activeRows.length}</strong>
											</div>
											<div>
												<p>status</p>
												<strong>live</strong>
											</div>
										</div>

										<div class="workflow-card">
											<div class="workflow-header">
												<span></span>
												<p>{activeTab.note}</p>
											</div>
											<div class="workflow-list">
												{#each activeRows as row, index (row)}
													<div class="workflow-row">
														<span>{index + 1}</span>
														<div>
															<strong>{row}</strong>
															<small>Connected to copy, route, and product state</small>
														</div>
													</div>
												{/each}
											</div>
										</div>
									</div>
								</div>
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
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.feature-copy {
		padding: 1.25rem;
		border-bottom: 1px solid var(--border);
	}

	.feature-eyebrow {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--muted-foreground);
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
		font-size: 0.8rem;
	}

	.feature-icon {
		display: inline-flex;
		width: 2.75rem;
		height: 2.75rem;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		border-radius: 0.85rem;
		background: var(--muted);
		color: var(--foreground);
	}

	.feature-copy h3 {
		margin-top: 1.25rem;
		max-width: 34rem;
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 650;
		line-height: 1.05;
		letter-spacing: 0;
	}

	.feature-copy p {
		margin-top: 1rem;
		max-width: 38rem;
		color: var(--muted-foreground);
		line-height: 1.75;
	}

	.feature-checklist {
		display: grid;
		gap: 0.6rem;
		margin-top: 1.5rem;
	}

	.feature-checklist div {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		color: var(--foreground);
		font-size: 0.92rem;
	}

	.feature-checklist span {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--primary);
	}

	.product-shell {
		margin: 1rem;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.95rem;
		background: var(--background);
	}

	.product-chrome {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
		border-bottom: 1px solid var(--border);
		padding: 0.75rem;
	}

	.product-chrome div {
		display: flex;
		gap: 0.35rem;
	}

	.product-chrome span {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 999px;
		background: color-mix(in oklch, var(--foreground) 16%, transparent);
	}

	.product-chrome p {
		overflow: hidden;
		color: var(--muted-foreground);
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
		font-size: 0.78rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.product-body {
		display: grid;
		min-height: 28rem;
	}

	.product-sidebar {
		display: none;
		border-right: 1px solid var(--border);
		background: color-mix(in oklch, var(--muted) 44%, transparent);
		padding: 0.85rem;
	}

	.sidebar-item {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		border-radius: 0.7rem;
		padding: 0.62rem 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.84rem;
		font-weight: 550;
	}

	.sidebar-item span {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: color-mix(in oklch, var(--foreground) 16%, transparent);
	}

	.sidebar-item-active {
		background: var(--background);
		color: var(--foreground);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.product-main {
		display: grid;
		align-content: start;
		gap: 0.9rem;
		padding: 0.9rem;
	}

	.metric-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.7rem;
	}

	.metric-row div,
	.workflow-card {
		border: 1px solid var(--border);
		border-radius: 0.85rem;
		background: var(--card);
	}

	.metric-row div {
		padding: 0.85rem;
	}

	.metric-row p {
		color: var(--muted-foreground);
		font-size: 0.72rem;
		text-transform: uppercase;
	}

	.metric-row strong {
		display: block;
		margin-top: 0.45rem;
		font-size: 1.2rem;
	}

	.workflow-card {
		overflow: hidden;
	}

	.workflow-header {
		display: grid;
		grid-template-columns: 0.4rem 1fr;
		gap: 0.75rem;
		border-bottom: 1px solid var(--border);
		padding: 1rem;
	}

	.workflow-header span {
		margin-top: 0.45rem;
		height: calc(100% - 0.45rem);
		border-radius: 999px;
		background: var(--primary);
	}

	.workflow-header p {
		color: var(--muted-foreground);
		line-height: 1.65;
	}

	.workflow-list {
		display: grid;
	}

	.workflow-row {
		display: grid;
		grid-template-columns: 2rem 1fr;
		gap: 0.75rem;
		padding: 0.95rem 1rem;
	}

	.workflow-row + .workflow-row {
		border-top: 1px solid var(--border);
	}

	.workflow-row > span {
		display: flex;
		width: 2rem;
		height: 2rem;
		align-items: center;
		justify-content: center;
		border-radius: 0.65rem;
		background: var(--muted);
		font-size: 0.8rem;
		font-weight: 700;
	}

	.workflow-row strong,
	.workflow-row small {
		display: block;
	}

	.workflow-row strong {
		font-size: 0.95rem;
	}

	.workflow-row small {
		margin-top: 0.22rem;
		color: var(--muted-foreground);
		font-size: 0.78rem;
		line-height: 1.45;
	}

	@media (min-width: 760px) {
		.feature-panel {
			grid-template-columns: 0.82fr 1.18fr;
		}

		.feature-copy {
			border-right: 1px solid var(--border);
			border-bottom: 0;
			padding: 1.5rem;
		}

		.product-body {
			grid-template-columns: 11rem 1fr;
		}

		.product-sidebar {
			display: grid;
			align-content: start;
			gap: 0.25rem;
		}
	}
</style>
