import { error } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_NAME, DEMO_ACCOUNT_PASSWORD } from '$lib/demo-account.js';
import type { RequestHandler } from './$types';

const authJsonHeaders = {
	accept: 'application/json',
	'content-type': 'application/json'
};

function getSetCookieHeaders(headers: Headers) {
	const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
	const values = getSetCookie?.call(headers);
	if (values?.length) return values;

	const header = headers.get('set-cookie');
	return header ? [header] : [];
}

async function readAuthFailure(response: Response) {
	const text = await response.text();
	if (!text) return `HTTP ${response.status}`;

	try {
		const data = JSON.parse(text) as { message?: string; error?: string };
		return data.message ?? data.error ?? text;
	} catch {
		return text;
	}
}

async function postAuth(fetch: typeof globalThis.fetch, url: URL, path: string, body: object) {
	return await fetch(new URL(`/api/auth/${path}`, url), {
		method: 'POST',
		headers: authJsonHeaders,
		body: JSON.stringify(body),
		redirect: 'manual'
	});
}

function isSuccessfulAuthResponse(response: Response) {
	return response.status >= 200 && response.status < 400;
}

function redirectWithAuthCookies(response: Response) {
	const headers = new Headers({
		location: resolve('/dashboard')
	});

	for (const cookie of getSetCookieHeaders(response.headers)) {
		headers.append('set-cookie', cookie);
	}

	return new Response(null, {
		status: 303,
		headers
	});
}

export const GET: RequestHandler = async ({ fetch, url }) => {
	const signInBody = {
		email: DEMO_ACCOUNT_EMAIL,
		password: DEMO_ACCOUNT_PASSWORD,
		callbackURL: resolve('/dashboard'),
		rememberMe: true
	};

	let signIn = await postAuth(fetch, url, 'sign-in/email', signInBody);

	if (!isSuccessfulAuthResponse(signIn)) {
		const signUp = await postAuth(fetch, url, 'sign-up/email', {
			name: DEMO_ACCOUNT_NAME,
			email: DEMO_ACCOUNT_EMAIL,
			password: DEMO_ACCOUNT_PASSWORD,
			callbackURL: resolve('/dashboard')
		});

		if (!isSuccessfulAuthResponse(signUp)) {
			const signUpFailure = await readAuthFailure(signUp);
			const normalized = signUpFailure.toLowerCase();
			if (!normalized.includes('already') && !normalized.includes('exist')) {
				error(502, `Demo account setup failed: ${signUpFailure}`);
			}
		}

		signIn = await postAuth(fetch, url, 'sign-in/email', signInBody);
	}

	if (!isSuccessfulAuthResponse(signIn)) {
		error(502, `Demo account sign-in failed: ${await readAuthFailure(signIn)}`);
	}

	const cookies = getSetCookieHeaders(signIn.headers);
	if (cookies.length === 0) {
		error(502, 'Demo account sign-in did not return a session cookie.');
	}

	return redirectWithAuthCookies(signIn);
};
