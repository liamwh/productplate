<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import BellRingIcon from '@lucide/svelte/icons/bell-ring';
	import BlocksIcon from '@lucide/svelte/icons/blocks';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChartNoAxesCombinedIcon from '@lucide/svelte/icons/chart-no-axes-combined';
	import FileCheck2Icon from '@lucide/svelte/icons/file-check-2';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import type { Component } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	type FeatureVisual =
		| 'analytics'
		| 'permissions'
		| 'blocks'
		| 'notes'
		| 'stack'
		| 'alerts'
		| 'calendar';

	interface FeatureItem {
		title: string;
		description: string;
		icon: Component;
		visual: FeatureVisual;
		size?: 'wide' | 'tall' | 'normal';
	}

	interface Props {
		kicker?: string;
		title?: string;
		description?: string;
		items?: readonly FeatureItem[];
	}

	let {
		kicker = 'Feature bento',
		title = 'The capabilities that sell the product.',
		description = 'Varied cells with real UI backgrounds.',
		items = [
			{
				title: 'Realtime product signals',
				description:
					'Show live metrics and chart movement instead of an abstract dashboard promise.',
				icon: ChartNoAxesCombinedIcon,
				visual: 'analytics',
				size: 'wide'
			},
			{
				title: 'Permission-ready flows',
				description: 'Auth, billing, and settings patterns share the same product shell.',
				icon: ShieldCheckIcon,
				visual: 'permissions',
				size: 'tall'
			},
			{
				title: 'Composable blocks',
				description: 'Sections are ordinary Svelte files with props and local dummy data.',
				icon: BlocksIcon,
				visual: 'blocks'
			},
			{
				title: 'Launch notes',
				description: 'Use compact checklists when a feature needs proof, risk, and owner context.',
				icon: FileCheck2Icon,
				visual: 'notes'
			},
			{
				title: 'Production stack',
				description: 'Explain the boring but important services without making a logo pile.',
				icon: BlocksIcon,
				visual: 'stack'
			},
			{
				title: 'Alertable states',
				description: 'Status rows, badges, and calls-to-action are ready for backend data.',
				icon: BellRingIcon,
				visual: 'alerts'
			},
			{
				title: 'Activity calendar',
				description:
					'A calendar surface that renders the same status vocabulary as the rest of the product.',
				icon: CalendarIcon,
				visual: 'calendar'
			}
		]
	}: Props = $props();

	const metrics = [
		{ label: 'Acquisition', value: '42%', scale: 42 },
		{ label: 'Activation', value: '68%', scale: 68 },
		{ label: 'Revenue', value: '91%', scale: 91 }
	] as const;

	type PermissionStatus = 'ready' | 'live' | 'review' | 'pending' | 'draft' | 'shipped';

	const permissions = [
		{ label: 'Protected route', status: 'ready' as PermissionStatus },
		{ label: 'Checkout event', status: 'live' as PermissionStatus },
		{ label: 'Profile update', status: 'ready' as PermissionStatus },
		{ label: 'Role change', status: 'review' as PermissionStatus },
		{ label: 'Audit log', status: 'pending' as PermissionStatus },
		{ label: 'SSO connect', status: 'draft' as PermissionStatus },
		{ label: 'Workspace invite', status: 'shipped' as PermissionStatus }
	] as const;

	const calendarMonth = 'June 2026';
	const calendarWeekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
	const calendarDays = Array.from({ length: 35 }, (_, i) => {
		const day = i + 1;
		return day <= 30 ? day : null;
	});
	const calendarToday = 25;
	const calendarEvents = [
		{ day: 4, status: 'live' as PermissionStatus, label: 'Webhook v2' },
		{ day: 8, status: 'shipped' as PermissionStatus, label: 'Beta launch' },
		{ day: 12, status: 'review' as PermissionStatus },
		{ day: 15, status: 'ready' as PermissionStatus },
		{ day: 18, status: 'live' as PermissionStatus, label: 'Onboarding rewrite' },
		{ day: 22, status: 'pending' as PermissionStatus },
		{ day: 26, status: 'review' as PermissionStatus },
		{ day: 30, status: 'draft' as PermissionStatus }
	] as const;

	const stack = ['SvelteKit', 'Convex', 'Better Auth', 'Autumn', 'AI SDK'] as const;
	const chartBars = [28, 48, 36, 64, 52, 78] as const;

	function eventForDay(day: number | null) {
		if (day === null) return undefined;
		return calendarEvents.find((event) => event.day === day);
	}
</script>

<section class="py-20 sm:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
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

		<div class="mt-12 grid auto-rows-[22rem] grid-cols-1 gap-4 lg:grid-cols-3">
			{#each items as item (item.title)}
				<article
					class={[
						'bento-card group',
						item.size === 'wide' ? 'lg:col-span-2' : '',
						item.size === 'tall' ? 'lg:row-span-2' : ''
					]
						.filter(Boolean)
						.join(' ')}
				>
					<div class="bento-background">
						{#if item.visual === 'analytics'}
							<div class="analytics-panel">
								<div class="flex items-center justify-between border-b pb-3">
									<div>
										<p class="text-sm font-semibold">Campaign overview</p>
										<p class="mt-1 text-xs text-muted-foreground">Last 30 days</p>
									</div>
									<Badge variant="secondary">Live</Badge>
								</div>
								<div class="mt-4 grid gap-3 sm:grid-cols-3">
									{#each metrics as metric (metric.label)}
										<div class="rounded-lg border bg-background p-3">
											<p class="text-xs text-muted-foreground">{metric.label}</p>
											<p class="mt-2 text-2xl font-semibold">{metric.value}</p>
											<div class="mt-3 flex h-16 items-end gap-1">
												{#each chartBars as height, index (index)}
													<span
														class="flex-1 rounded-t-sm bg-primary"
														style={`height: ${Math.max(18, (height * metric.scale) / 100)}%`}
													></span>
												{/each}
											</div>
										</div>
									{/each}
								</div>
							</div>
						{:else if item.visual === 'permissions'}
							<div class="permissions-panel">
								{#each permissions as permission (permission.label)}
									<div
										class="flex items-center justify-between rounded-lg border bg-background px-3 py-2"
									>
										<span class="text-sm">{permission.label}</span>
										<Badge
											variant={permission.status === 'live' || permission.status === 'shipped'
												? 'default'
												: permission.status === 'pending' || permission.status === 'review'
													? 'outline'
													: 'secondary'}
										>
											{permission.status}
										</Badge>
									</div>
								{/each}
							</div>
						{:else if item.visual === 'blocks'}
							<div class="blocks-panel" aria-hidden="true">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
						{:else if item.visual === 'notes'}
							<div class="notes-panel">
								<p class="text-sm font-semibold">Ship checklist</p>
								{#each ['Swap copy', 'Attach screenshot', 'Point CTA', 'Cut unused sections'] as note (note)}
									<div class="mt-3 flex items-center gap-2 text-sm">
										<span class="size-2 rounded-full bg-primary"></span>
										<span>{note}</span>
									</div>
								{/each}
							</div>
						{:else if item.visual === 'stack'}
							<div class="stack-panel">
								{#each stack as service, index (service)}
									<span style={`--stack-index: ${index}`}>{service}</span>
								{/each}
							</div>
						{:else if item.visual === 'alerts'}
							<div class="alerts-panel">
								{#each ['Trial started', 'Plan upgraded', 'Invite accepted'] as alert (alert)}
									<div class="rounded-lg border bg-background px-3 py-2">
										<p class="text-sm font-medium">{alert}</p>
										<p class="mt-1 text-xs text-muted-foreground">Synced to product state</p>
									</div>
								{/each}
							</div>
						{:else if item.visual === 'calendar'}
							<div class="calendar-panel">
								<div class="calendar-header">
									<span class="calendar-month">{calendarMonth}</span>
									<span class="calendar-today">Today</span>
								</div>
								<div class="calendar-weekdays">
									{#each calendarWeekdays as weekday (weekday)}
										<span>{weekday}</span>
									{/each}
								</div>
								<div class="calendar-grid">
									{#each calendarDays as day, index (index)}
										{@const event = eventForDay(day)}
										<div
											class={[
												'calendar-cell',
												day === calendarToday ? 'calendar-today-cell' : '',
												event ? `calendar-cell-active calendar-cell-${event.status}` : ''
											]
												.filter(Boolean)
												.join(' ')}
										>
											{#if day !== null}
												<span class="calendar-day-number">{day}</span>
												{#if event}
													<span class="calendar-dot" aria-hidden="true"></span>
												{/if}
											{/if}
										</div>
									{/each}
								</div>
								<div class="calendar-legend">
									<span
										><span class="calendar-dot calendar-dot-live" aria-hidden="true"
										></span>Live</span
									>
									<span
										><span class="calendar-dot calendar-dot-review" aria-hidden="true"
										></span>Review</span
									>
									<span
										><span class="calendar-dot calendar-dot-draft" aria-hidden="true"
										></span>Draft</span
									>
								</div>
							</div>
						{/if}
					</div>

					<div class="bento-scrim" aria-hidden="true">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>

					<div class="bento-copy">
						<item.icon
							class="size-10 text-foreground/75 transition-transform duration-300 group-hover:scale-90"
						/>
						<h3 class="mt-3 text-xl font-semibold tracking-tight">{item.title}</h3>
						<p class="mt-2 max-w-lg leading-7 text-muted-foreground">{item.description}</p>
					</div>

					<div class="bento-cta">
						<Button href="#patterns" variant="link" size="sm" class="p-0">
							Use this pattern
							<ArrowRightIcon data-icon="inline-end" />
						</Button>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.bento-card {
		position: relative;
		display: flex;
		isolation: isolate;
		overflow: hidden;
		min-height: 22rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--card);
		box-shadow:
			0 0 0 1px color-mix(in oklch, var(--foreground) 3%, transparent),
			0 2px 4px color-mix(in oklch, var(--foreground) 5%, transparent),
			0 12px 24px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.bento-card::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		transition: background-color 220ms ease;
	}

	.bento-card:hover::after {
		background: color-mix(in oklch, var(--foreground) 3%, transparent);
	}

	.bento-background {
		position: absolute;
		inset: 0;
		overflow: hidden;
		padding: 1rem;
		opacity: 0.96;
	}

	.bento-scrim {
		position: absolute;
		z-index: 1;
		right: 0;
		bottom: 0;
		left: 0;
		height: 84%;
		pointer-events: none;
		background: linear-gradient(
			to top,
			var(--card) 0%,
			color-mix(in oklch, var(--card) 98%, transparent) 26%,
			color-mix(in oklch, var(--card) 82%, transparent) 48%,
			color-mix(in oklch, var(--card) 46%, transparent) 70%,
			transparent 100%
		);
	}

	.bento-scrim::before {
		content: '';
		position: absolute;
		inset: auto 0 0;
		height: 58%;
		background: linear-gradient(
			to top,
			var(--card),
			color-mix(in oklch, var(--card) 82%, transparent),
			transparent
		);
	}

	.bento-scrim span {
		position: absolute;
		inset: 0;
	}

	.bento-scrim span:nth-child(1) {
		backdrop-filter: blur(0.5px);
		-webkit-backdrop-filter: blur(0.5px);
		mask-image: linear-gradient(to bottom, transparent 2%, black 14%, black 26%, transparent 38%);
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 2%,
			black 14%,
			black 26%,
			transparent 38%
		);
	}

	.bento-scrim span:nth-child(2) {
		backdrop-filter: blur(1.5px);
		-webkit-backdrop-filter: blur(1.5px);
		mask-image: linear-gradient(to bottom, transparent 20%, black 34%, black 48%, transparent 62%);
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 20%,
			black 34%,
			black 48%,
			transparent 62%
		);
	}

	.bento-scrim span:nth-child(3) {
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		mask-image: linear-gradient(to bottom, transparent 38%, black 52%, black 68%, transparent 82%);
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 38%,
			black 52%,
			black 68%,
			transparent 82%
		);
	}

	.bento-scrim span:nth-child(4) {
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		mask-image: linear-gradient(to bottom, transparent 58%, black 74%, black 90%, transparent 100%);
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 58%,
			black 74%,
			black 90%,
			transparent 100%
		);
	}

	.bento-scrim span:nth-child(5) {
		backdrop-filter: blur(32px);
		-webkit-backdrop-filter: blur(32px);
		mask-image: linear-gradient(to bottom, transparent 76%, black 100%);
		-webkit-mask-image: linear-gradient(to bottom, transparent 76%, black 100%);
	}

	.bento-copy {
		position: relative;
		z-index: 2;
		margin-top: auto;
		padding: 1.25rem;
		transition: transform 240ms ease;
	}

	.bento-card:hover .bento-copy {
		transform: translateY(-1.75rem);
	}

	.bento-cta {
		position: absolute;
		z-index: 2;
		left: 1.25rem;
		bottom: 1.1rem;
		opacity: 0;
		transform: translateY(0.6rem);
		transition:
			opacity 220ms ease,
			transform 220ms ease;
	}

	.bento-card:hover .bento-cta {
		opacity: 1;
		transform: translateY(0);
	}

	.analytics-panel,
	.permissions-panel,
	.notes-panel,
	.alerts-panel,
	.calendar-panel {
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: color-mix(in oklch, var(--background) 88%, transparent);
		padding: 1rem;
		box-shadow: 0 12px 24px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.permissions-panel,
	.alerts-panel {
		display: grid;
		gap: 0.65rem;
	}

	.blocks-panel {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.55rem;
		width: min(18rem, 82%);
		margin: 0 auto;
		padding-top: 1rem;
	}

	.blocks-panel span {
		min-height: 4.25rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: color-mix(in oklch, var(--muted) 70%, var(--background));
	}

	.blocks-panel span:nth-child(1),
	.blocks-panel span:nth-child(6) {
		grid-column: span 2;
	}

	.notes-panel {
		width: min(18rem, 86%);
		margin-left: auto;
	}

	.stack-panel {
		position: relative;
		width: min(21rem, 92%);
		height: 13rem;
		margin: 0 auto;
	}

	.stack-panel span {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 9rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--background);
		padding: 0.55rem 0.75rem;
		text-align: center;
		font-size: 0.8rem;
		font-weight: 650;
		box-shadow: 0 12px 20px color-mix(in oklch, var(--foreground) 5%, transparent);
	}

	.stack-panel span:nth-child(1) {
		transform: translate(-95%, -122%) rotate(-8deg);
	}

	.stack-panel span:nth-child(2) {
		transform: translate(-6%, -102%) rotate(7deg);
	}

	.stack-panel span:nth-child(3) {
		z-index: 1;
		border-color: color-mix(in oklch, var(--primary) 32%, var(--border));
		background: color-mix(in oklch, var(--primary) 8%, var(--background));
		transform: translate(-50%, -50%) scale(1.04);
	}

	.stack-panel span:nth-child(4) {
		transform: translate(-100%, 20%) rotate(6deg);
	}

	.stack-panel span:nth-child(5) {
		transform: translate(-8%, 34%) rotate(-7deg);
	}

	.calendar-panel {
		display: grid;
		gap: 0.55rem;
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.calendar-month {
		font-size: 0.82rem;
		font-weight: 650;
		letter-spacing: 0;
	}

	.calendar-today {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	.calendar-weekdays {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 0.15rem;
		color: var(--muted-foreground);
		font-size: 0.6rem;
		font-weight: 650;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.calendar-weekdays span {
		display: grid;
		place-items: center;
		padding: 0.1rem 0;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 0.2rem;
	}

	.calendar-cell {
		position: relative;
		aspect-ratio: 1 / 1;
		display: grid;
		place-items: center;
		border-radius: 0.4rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
		font-weight: 600;
	}

	.calendar-cell-active {
		color: var(--foreground);
	}

	.calendar-today-cell {
		border: 1px solid color-mix(in oklch, var(--primary) 55%, transparent);
		background: color-mix(in oklch, var(--primary) 10%, transparent);
	}

	.calendar-cell-live,
	.calendar-cell-shipped {
		background: color-mix(in oklch, var(--primary) 14%, transparent);
	}

	.calendar-cell-live .calendar-dot,
	.calendar-cell-shipped .calendar-dot {
		background: var(--primary);
	}

	.calendar-cell-review,
	.calendar-cell-pending {
		background: color-mix(in oklch, var(--muted-foreground) 10%, transparent);
	}

	.calendar-cell-review .calendar-dot,
	.calendar-cell-pending .calendar-dot {
		background: var(--muted-foreground);
	}

	.calendar-cell-ready,
	.calendar-cell-draft {
		background: color-mix(in oklch, var(--muted-foreground) 5%, transparent);
	}

	.calendar-cell-ready .calendar-dot,
	.calendar-cell-draft .calendar-dot {
		background: transparent;
		border: 1px solid var(--muted-foreground);
	}

	.calendar-day-number {
		line-height: 1;
	}

	.calendar-dot {
		position: absolute;
		bottom: 0.2rem;
		left: 50%;
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 999px;
		transform: translateX(-50%);
	}

	.calendar-legend {
		display: flex;
		gap: 0.85rem;
		padding-top: 0.35rem;
		color: var(--muted-foreground);
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.calendar-legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.calendar-legend .calendar-dot {
		position: static;
		transform: none;
	}

	.calendar-dot-live {
		background: var(--primary);
	}

	.calendar-dot-review {
		background: var(--muted-foreground);
	}

	.calendar-dot-draft {
		background: transparent;
		border: 1px solid var(--muted-foreground);
	}

	@media (max-width: 1023px) {
		.bento-card:hover .bento-copy {
			transform: none;
		}

		.bento-cta {
			position: relative;
			left: auto;
			bottom: auto;
			align-self: end;
			margin: auto 1.25rem 1.1rem;
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bento-card,
		.bento-card *,
		.bento-card::after {
			transition: none;
		}
	}
</style>
