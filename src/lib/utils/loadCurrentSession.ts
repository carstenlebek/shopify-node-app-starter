import { NextRequest } from 'next/server';
import { UPSTASH_REDIS_HEADERS } from '../constants';
import { getCurrentSessionId } from '@lib/oauth/getCurrentSessionId';

export interface OnlineAccessInfo {
	expires_in: number;
	associated_user_scope: string;
	associated_user: {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
		email_verified: boolean;
		account_owner: boolean;
		locale: string;
		collaborator: boolean;
	};
}

export interface SessionInterface {
	readonly id: string;
	shop: string;
	state: string;
	isOnline: boolean;
	scope?: string;
	expires?: Date;
	accessToken?: string;
	onlineAccessInfo?: OnlineAccessInfo;
	isActive(): boolean;
}

/**
 * Loads the current user's session, based on the given request and response.
 *
 * @param request  Current HTTP request
 * @param response Current HTTP response
 * @param isOnline Whether to load online (default) or offline sessions (optional)
 */
export default async function loadCurrentSession(
	request: NextRequest,
	isOnline = true
): Promise<SessionInterface | undefined> {
	const sessionId = getCurrentSessionId(request, isOnline);
	if (!sessionId) {
		return Promise.resolve(undefined);
	}

	const { result } = await fetch(
		`${process.env.UPSTASH_REDIS_REST_URL}/get/${sessionId}`,
		{
			method: 'GET',
			headers: UPSTASH_REDIS_HEADERS,
		}
	).then((res) => res.json());

	const session = JSON.parse(result);

	return session;
}
