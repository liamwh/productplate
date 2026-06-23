export const DEMO_ACCOUNT_EMAIL = 'demo@productplate.dev';
export const DEMO_ACCOUNT_PASSWORD = 'productplate-demo-access';
export const DEMO_ACCOUNT_NAME = 'Product Plate Demo';

export const DEMO_PROFILE = {
	displayName: 'Product Plate Demo',
	bio: 'Exploring Product Plate from the hosted demo workspace.',
	role: 'Demo founder',
	workspaceName: 'Demo Workspace'
} as const;

export function isDemoAccountEmail(email: string | null | undefined) {
	return email?.toLowerCase() === DEMO_ACCOUNT_EMAIL;
}
