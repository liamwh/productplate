<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import InfoIcon from '@lucide/svelte/icons/info';
	import XIcon from '@lucide/svelte/icons/x';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';

	type Billing = 'monthly' | 'annually';

	interface Plan {
		title: string;
		price: { monthly: string; annually: string };
		href: string;
		cta: string;
		recommended?: boolean;
	}

	type InclusionValue = string | 'check' | 'cross' | 'addon';

	interface Inclusion {
		plan: string;
		content: InclusionValue;
	}

	interface Feature {
		title: string;
		info?: string;
		inclusions: readonly Inclusion[];
	}

	interface FeatureGroup {
		title: string;
		features: readonly Feature[];
	}

	interface Props {
		plans?: readonly Plan[];
		featureMatrix?: readonly FeatureGroup[];
	}

	let {
		plans = [
			{ title: 'Free', price: { monthly: '$0', annually: '$0' }, href: '#', cta: 'Start free' },
			{
				title: 'Basic',
				price: { monthly: '$50', annually: '$45' },
				href: '#',
				cta: 'Choose Basic'
			},
			{
				title: 'Team',
				price: { monthly: '$100', annually: '$90' },
				href: '#',
				cta: 'Choose Team',
				recommended: true
			},
			{
				title: 'Enterprise',
				price: { monthly: '$200', annually: '$160' },
				href: '#',
				cta: 'Contact sales'
			}
		],
		featureMatrix = [
			{
				title: 'Overview',
				features: [
					{
						title: 'Always included',
						inclusions: [
							{ plan: 'Free', content: 'Core starter routes and UI primitives.' },
							{ plan: 'Basic', content: 'Core starter routes and UI primitives.' },
							{ plan: 'Teams', content: 'Core starter routes and UI primitives.' },
							{ plan: 'Enterprise', content: 'Core starter routes and UI primitives.' }
						]
					},
					{
						title: 'Number of products',
						info: 'How many product workspaces you can run at once.',
						inclusions: [
							{ plan: 'Free', content: '1' },
							{ plan: 'Basic', content: '1' },
							{ plan: 'Team', content: '3' },
							{ plan: 'Enterprise', content: '5' }
						]
					},
					{
						title: 'Monthly transactions',
						info: 'Backend function calls measured per month.',
						inclusions: [
							{ plan: 'Free', content: '30 monthly' },
							{ plan: 'Basic', content: 'Unlimited' },
							{ plan: 'Team', content: 'Unlimited' },
							{ plan: 'Enterprise', content: 'Unlimited' }
						]
					},
					{
						title: 'Team seats',
						info: 'How many people can be invited to a workspace.',
						inclusions: [
							{ plan: 'Free', content: '2' },
							{ plan: 'Basic', content: '5' },
							{ plan: 'Team', content: '20' },
							{ plan: 'Enterprise', content: 'Unlimited' }
						]
					},
					{
						title: 'File storage',
						info: 'Storage cap for uploads and profile images.',
						inclusions: [
							{ plan: 'Free', content: '500 MB' },
							{ plan: 'Basic', content: '10 GB' },
							{ plan: 'Team', content: '100 GB' },
							{ plan: 'Enterprise', content: '1 TB' }
						]
					},
					{
						title: 'API rate limit',
						info: 'Requests per minute against public endpoints.',
						inclusions: [
							{ plan: 'Free', content: '60' },
							{ plan: 'Basic', content: '500' },
							{ plan: 'Team', content: '2,000' },
							{ plan: 'Enterprise', content: '10,000' }
						]
					}
				]
			},
			{
				title: 'Other features',
				features: [
					{
						title: 'Basic feature',
						inclusions: [
							{ plan: 'Free', content: 'check' },
							{ plan: 'Basic', content: 'check' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Custom domain',
						info: 'Bring your own hostname for the dashboard and emails.',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'check' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'White-label branding',
						info: 'Replace Product Plate logos with your own brand.',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Advanced analytics',
						info: 'Cohort, funnel, and retention dashboards.',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Enterprise feature',
						info: 'Only available on the Enterprise plan.',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'cross' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Optional feature',
						info: 'Available as a paid add-on.',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'addon' },
							{ plan: 'Enterprise', content: 'addon' }
						]
					}
				]
			},
			{
				title: 'Support',
				features: [
					{
						title: 'Community forum',
						inclusions: [
							{ plan: 'Free', content: 'check' },
							{ plan: 'Basic', content: 'check' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Email support',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'check' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Live chat support',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Dedicated success manager',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'cross' },
							{ plan: 'Enterprise', content: 'check' }
						]
					}
				]
			},
			{
				title: 'Security',
				features: [
					{
						title: 'Two-factor authentication',
						inclusions: [
							{ plan: 'Free', content: 'check' },
							{ plan: 'Basic', content: 'check' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'SSO authentication',
						info: 'Single sign-on through OIDC and SAML providers.',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'addon' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Audit log',
						info: 'Workspace events with export and retention controls.',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'check' },
							{ plan: 'Enterprise', content: 'check' }
						]
					},
					{
						title: 'Compliance reports',
						info: 'SOC 2 and ISO 27001 reports available on request.',
						inclusions: [
							{ plan: 'Free', content: 'cross' },
							{ plan: 'Basic', content: 'cross' },
							{ plan: 'Team', content: 'cross' },
							{ plan: 'Enterprise', content: 'check' }
						]
					}
				]
			}
		]
	}: Props = $props();

	let billing = $state<Billing>('monthly');

	function renderValue(value: InclusionValue) {
		if (value === 'check') return { component: true, text: '' };
		if (value === 'cross') return { component: false, text: '' };
		if (value === 'addon') return { addon: true, text: '' };
		return { text: value };
	}
</script>

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-8 max-w-2xl">
			<h2 class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">Pricing plans</h2>
			<p class="mt-3 text-base leading-7 text-muted-foreground">
				Compare every plan side by side. Switch billing to see annual pricing.
			</p>
		</div>

		<div class="bg-background lg:sticky lg:top-16 lg:z-10">
			<div class="pt-6">
				<div class="grid items-end gap-6 border-b pb-8 lg:grid-cols-6">
					<div class="lg:col-span-2">
						<div class="flex h-full flex-col justify-end">
							<span class="mb-2 text-xs font-medium text-muted-foreground">Billing</span>
							<Tabs.Root bind:value={billing}>
								<Tabs.List>
									<Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
									<Tabs.Trigger value="annually">Annually</Tabs.Trigger>
								</Tabs.List>
							</Tabs.Root>
						</div>
					</div>
					{#each plans as plan (plan.title)}
						<div class="rounded-lg border p-3 2xl:p-4">
							<h3 class="mb-1 text-xl font-medium xl:text-2xl">{plan.title}</h3>
							<p class="mb-4 text-sm font-medium text-muted-foreground">
								{plan.price[billing]}
								<span class="hidden 2xl:inline"> / monthly</span>
							</p>
							<Button
								href={plan.href}
								variant={plan.recommended ? 'default' : 'outline'}
								class="w-full"
							>
								{plan.cta}
							</Button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-8 lg:space-y-12">
			{#each featureMatrix as group (group.title)}
				<div>
					<h3 class="mb-6 text-lg font-medium lg:mb-3">{group.title}</h3>
					<Tooltip.Provider delayDuration={150}>
						{#each group.features as feature (feature.title)}
							{@const hasInfo = Boolean(feature.info)}
							<dl class="hidden grid-cols-6 gap-6 border-b lg:grid">
								<dt class="col-span-2 py-4">
									{#if hasInfo}
										<Tooltip.Root>
											<Tooltip.Trigger>
												<span class="group flex min-h-6 items-center gap-x-1 font-medium">
													{feature.title}
													<InfoIcon
														class="ml-2 size-4 cursor-pointer text-muted-foreground group-hover:text-accent-foreground"
													/>
												</span>
											</Tooltip.Trigger>
											<Tooltip.Content>{feature.info}</Tooltip.Content>
										</Tooltip.Root>
									{:else}
										<span class="group flex min-h-6 items-center font-medium">{feature.title}</span>
									{/if}
								</dt>
								{#each feature.inclusions as inclusion (inclusion.plan)}
									{@const rendered = renderValue(inclusion.content)}
									<dd class="hidden py-4 text-sm text-muted-foreground lg:block">
										{#if 'component' in rendered && rendered.component}
											<CheckIcon class="size-4 lg:size-5" />
										{:else if 'component' in rendered && !rendered.component}
											<XIcon class="size-4 text-muted-foreground lg:size-5" />
										{:else if 'addon' in rendered && rendered.addon}
											<Badge>Add-on</Badge>
										{:else}
											{rendered.text}
										{/if}
									</dd>
								{/each}
							</dl>

							<Collapsible.Root class="group lg:hidden">
								<dl class="border-b">
									<Collapsible.Trigger class="w-full">
										<dt class="flex items-center justify-between pb-4">
											{#if hasInfo}
												<Tooltip.Root>
													<Tooltip.Trigger>
														<span
															class="group flex items-center gap-x-1 text-sm font-medium md:text-base"
														>
															{feature.title}
															<InfoIcon
																class="ml-2 size-4 cursor-pointer text-muted-foreground group-hover:text-accent-foreground"
															/>
														</span>
													</Tooltip.Trigger>
													<Tooltip.Content>{feature.info}</Tooltip.Content>
												</Tooltip.Root>
											{:else}
												<span class="flex items-center gap-x-1 text-sm font-medium md:text-base"
													>{feature.title}</span
												>
											{/if}
											<ChevronDownIcon
												class="size-5 transition-transform group-data-[state=open]:rotate-180"
											/>
										</dt>
									</Collapsible.Trigger>
									<Collapsible.Content>
										{#each feature.inclusions as inclusion (inclusion.plan)}
											{@const rendered = renderValue(inclusion.content)}
											<dd
												class="flex items-center border-b py-3 text-xs text-muted-foreground last:border-b-0 md:py-3.5"
											>
												<div class="w-1/2 md:w-1/4">{inclusion.plan}</div>
												{#if 'component' in rendered && rendered.component}
													<CheckIcon class="size-4" />
												{:else if 'component' in rendered && !rendered.component}
													<XIcon class="size-4 text-muted-foreground" />
												{:else if 'addon' in rendered && rendered.addon}
													<Badge>Add-on</Badge>
												{:else}
													{rendered.text}
												{/if}
											</dd>
										{/each}
									</Collapsible.Content>
								</dl>
							</Collapsible.Root>
						{/each}
					</Tooltip.Provider>
				</div>
			{/each}
		</div>

		<p class="mt-4 hidden text-xs text-muted-foreground md:block">* Caveats and other conditions</p>
	</div>
</section>
