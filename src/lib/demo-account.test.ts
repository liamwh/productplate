import { describe, expect, it } from 'vitest';
import {
	createDemoAccountCredentials,
	DEMO_ACCOUNT_EMAIL,
	isDemoAccountEmail
} from './demo-account.js';

describe('demo account helpers', () => {
	it('creates recognized disposable demo credentials', () => {
		const account = createDemoAccountCredentials('A1-B2-C3');

		expect(account).toEqual({
			name: 'Product Plate Demo',
			email: 'demo-a1-b2-c3@productplate.dev',
			password: 'productplate-demo-access-a1-b2-c3'
		});
		expect(isDemoAccountEmail(account.email)).toBe(true);
	});

	it('recognizes the legacy shared demo email but rejects normal users', () => {
		expect(isDemoAccountEmail(DEMO_ACCOUNT_EMAIL)).toBe(true);
		expect(isDemoAccountEmail('founder@example.com')).toBe(false);
		expect(isDemoAccountEmail(null)).toBe(false);
	});
});
