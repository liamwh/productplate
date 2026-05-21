import { product } from 'atmn';

// Features

// Products
export const free = product({
	id: 'free',
	name: 'Free',
	items: []
});

export const pro = product({
	id: 'pro',
	name: 'Pro',
	items: [],
	free_trial: {
		duration: 'undefined',
		length: undefined,
		unique_fingerprint: undefined,
		card_required: true
	}
});
