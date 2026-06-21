import type { Handle } from '@sveltejs/kit';
import { createAuth } from '$convex/auth.js';
import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { env } from '$env/dynamic/private';

try {
	const siteUrl = env.SITE_URL;
	if (siteUrl && typeof process !== 'undefined' && !process.env.SITE_URL) {
		process.env.SITE_URL = siteUrl;
	}
} catch {
	// process.env not available (e.g. Cloudflare Workers)
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.token = await getToken(createAuth, event.cookies);

	return resolve(event);
};
