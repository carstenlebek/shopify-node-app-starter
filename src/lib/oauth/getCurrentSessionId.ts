import { NextRequest } from 'next/server';
import decodeSessionToken from './decodeSessionToken';

const SESSION_COOKIE_NAME = 'shopify_app_session';

/**
 * Builds a JWT session id from the current shop and user.
 *
 * @param shop Shopify shop domain
 * @param userId Current actor id
 */
function getJwtSessionId(shop: string, userId: string): string {
	return `${shop}_${userId}`;
}

/**
 * Builds an offline session id for the given shop.
 *
 * @param shop Shopify shop domain
 */
function getOfflineSessionId(shop: string): string {
	return `offline_${shop}`;
}

/**
 * Loads the current session id from the session cookie.
 *
 * @param request HTTP request object
 * @param response HTTP response object
 */
// function getCookieSessionId(request, response): string | undefined {
// 	const cookies = new Cookies(request, response, {
// 		secure: true,
// 		keys: [process.env.SHOPIFY_API_SECRET_KEY],
// 	});
// 	return cookies.get(SESSION_COOKIE_NAME, { signed: true });
// }

/**
 * Extracts the current session id from the request / response pair.
 *
 * @param request  HTTP request object
 * @param response HTTP response object
 * @param isOnline Whether to load online (default) or offline sessions (optional)
 */
export function getCurrentSessionId(
	request: NextRequest,
	isOnline = true
): string | undefined {
	let currentSessionId: string | undefined;

	const authHeader = request.headers.get('authorization');

	if (authHeader) {
		const matches = authHeader.match(/^Bearer (.+)$/);
		if (!matches) {
			throw 'Missing Bearer token in authorization header';
		}

		const jwtPayload = decodeSessionToken(matches[1]);
		const shop = jwtPayload.dest.replace(/^https:\/\//, '');
		if (isOnline) {
			currentSessionId = getJwtSessionId(shop, jwtPayload.sub);
		} else {
			currentSessionId = getOfflineSessionId(shop);
		}
	}

	// Non-embedded apps will always load sessions using cookies. However, we fall back to the cookie session for
	// embedded apps to allow apps to load their skeleton page after OAuth, so they can set up App Bridge and get a new
	// JWT.
	if (!currentSessionId) {
		// TODO: We still want to get the offline session id from the cookie to make sure it's validated
		// currentSessionId = getCookieSessionId(request, response);
	}

	return currentSessionId;
}
