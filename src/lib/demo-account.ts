export const DEMO_ACCOUNT_EMAIL = 'demo@productplate.dev';
export const DEMO_ACCOUNT_EMAIL_PREFIX = 'demo-';
export const DEMO_ACCOUNT_EMAIL_DOMAIN = 'productplate.dev';
export const DEMO_ACCOUNT_PASSWORD_PREFIX = 'productplate-demo-access';
export const DEMO_ACCOUNT_NAME = 'Product Plate Demo';

const GENERATED_DEMO_EMAIL_PATTERN = /^demo-[a-z0-9][a-z0-9-]*@productplate\.dev$/;

export const DEMO_PROFILE = {
	displayName: 'Product Plate Demo',
	bio: 'Exploring Product Plate from the hosted demo workspace.',
	role: 'Demo founder',
	workspaceName: 'Demo Workspace'
} as const;

export function createDemoAccountCredentials(id: string = globalThis.crypto.randomUUID()) {
	const normalizedId = id.replace(/[^a-z0-9-]/gi, '').toLowerCase();

	return {
		name: DEMO_ACCOUNT_NAME,
		email: `${DEMO_ACCOUNT_EMAIL_PREFIX}${normalizedId}@${DEMO_ACCOUNT_EMAIL_DOMAIN}`,
		password: `${DEMO_ACCOUNT_PASSWORD_PREFIX}-${normalizedId}`
	};
}

export function isDemoAccountEmail(email: string | null | undefined) {
	const normalizedEmail = email?.toLowerCase();
	if (!normalizedEmail) return false;
	return (
		normalizedEmail === DEMO_ACCOUNT_EMAIL || GENERATED_DEMO_EMAIL_PATTERN.test(normalizedEmail)
	);
}
