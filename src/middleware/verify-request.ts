import { NextRequest, NextResponse } from 'next/server';

import decodeSessionToken from '@lib/oauth/decodeSessionToken';
import isSessionActive from '@helpers/is-session-active';
import loadCurrentSession from '@lib/utils/loadCurrentSession';
import returnTopLevelRedirection from '@helpers/return-top-level-redirection';

const TEST_GRAPHQL_QUERY = `
{
  shop {
    name
  }
}`;

export default async function verifyRequest(
	req: NextRequest,
	query: any
): Promise<NextResponse> {
	const res = NextResponse;

	const session = await loadCurrentSession(req, true);

	let shop = query.shop;

	if (session && shop && session.shop !== shop) {
		// The current request is for a different shop. Redirect gracefully.
		return res.redirect(`${process.env.HOST}/api/auth?shop=${shop}`);
	}

	if (isSessionActive(session)) {
		try {
			// TODO: Make a request to ensure the access token is still valid. Otherwise, re-authenticate the user.
			// const client = new Shopify.Clients.Graphql(
			// 	session.shop,
			// 	session.accessToken
			// );
			// await client.query({ data: TEST_GRAPHQL_QUERY });
			return res.next();
		} catch (e: any) {
			if (
				// e instanceof Shopify.Errors.HttpResponseError &&
				e.response.code === 401
			) {
				// TODO: Re-authenticate if we get a 401 response
			} else {
				throw e;
			}
		}
	}

	const bearerPresent = req.headers.get('authorization')?.match(/Bearer (.*)/);

	if (bearerPresent) {
		if (!shop) {
			if (session) {
				shop = session.shop;
			} else if (true) {
				if (bearerPresent) {
					const payload = decodeSessionToken(bearerPresent[1]);
					shop = payload.dest.replace('https://', '');
				}
			}
		}
	}

	return returnTopLevelRedirection(
		req,
		`${process.env.HOST}/api/auth?shop=${shop}`
	);
}
