import { feature, product, featureItem } from 'atmn';

// Features

export const projects = feature({
	id: 'projects',
	name: 'Projects',
	type: 'metered',
	consumable: false
});

export const apiCalls = feature({
	id: 'api_calls',
	name: 'API Calls',
	type: 'metered',
	consumable: true
});

export const prioritySupport = feature({
	id: 'priority_support',
	name: 'Priority Support',
	type: 'boolean'
});

// Products

export const free = product({
	id: 'free',
	name: 'Free',
	is_default: true,
	items: [
		featureItem({
			feature_id: projects.id,
			included_usage: 3
		}),

		featureItem({
			feature_id: apiCalls.id,
			included_usage: 100,
			interval: 'month'
		})
	]
});

export const pro = product({
	id: 'pro',
	name: 'Pro',
	items: [
		featureItem({
			feature_id: projects.id,
			included_usage: 25
		}),

		featureItem({
			feature_id: apiCalls.id,
			included_usage: 5_000,
			interval: 'month'
		}),

		featureItem({
			feature_id: prioritySupport.id
		})
	]
});

export const premium = product({
	id: 'premium',
	name: 'Premium',
	items: [
		featureItem({
			feature_id: projects.id,
			included_usage: 100
		}),

		featureItem({
			feature_id: apiCalls.id,
			included_usage: 25_000,
			interval: 'month'
		}),

		featureItem({
			feature_id: prioritySupport.id
		})
	]
});

export default {
	features: [projects, apiCalls, prioritySupport],
	products: [free, pro, premium]
};
