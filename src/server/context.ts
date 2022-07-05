import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { SessionInterface } from '@shopify/shopify-api';
import Shopify from '@lib/shopify';
import { inferAsyncReturnType } from '@trpc/server';
import isSessionActive from '@helpers/is-session-active';

export async function createContext({
	req,
	res,
}: trpcNext.CreateNextContextOptions): Promise<{
	session: SessionInterface | undefined;
}> {
	// Create your context based on the request object
	// Will be available as `ctx` in all your resolvers

	async function getSession() {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true);
        console.log("🚀 ~ file: context.ts ~ line 20 ~ getSession ~ session", session)
		let shop = req.query.shop;
        console.log("🚀 ~ file: context.ts ~ line 22 ~ getSession ~ shop", shop)

		if (session && shop && session.shop !== shop) {
			// The current request is for a different shop. Redirect gracefully.
			res.redirect(`${process.env.HOST}/api/auth?shop=${shop}`);
		}
		if (isSessionActive(session)) {
			try {
				// TODO: Make a request to ensure the access token is still valid. Otherwise, re-authenticate the user.
				// const client = new Shopify.Clients.Graphql(
				// 	session.shop,
				// 	session.accessToken
				// );
				// await client.query({ data: TEST_GRAPHQL_QUERY });
				return session;
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

		const bearerPresent = req.headers.authorization?.match(/Bearer (.*)/);
        console.log("🚀 ~ file: context.ts ~ line 50 ~ getSession ~ bearerPresent", bearerPresent)

		if (bearerPresent) {
			if (!shop) {
				if (session) {
					shop = session.shop;
				} else if (true) {
					if (bearerPresent) {
						const payload = Shopify.Utils.decodeSessionToken(bearerPresent[1]);
						shop = payload.dest.replace('https://', '');
					}
				}
			}
		}

		const redirectUrl = `${process.env.HOST}/api/auth?shop=${shop}`;
        console.log("🚀 ~ file: context.ts ~ line 66 ~ getSession ~ redirectUrl", redirectUrl)
		// If the request has a bearer token, the app is currently embedded, and must break out of the iframe to
		// re-authenticate
		if (bearerPresent) {
			res.setHeader('X-Shopify-API-Request-Failure-Reauthorize', '1');
			res.setHeader(
				'X-Shopify-API-Request-Failure-Reauthorize-Url',
				`${process.env.HOST}/api/auth?shop=${shop}`
			);
			res.send(null);
		} else {
			res.redirect(redirectUrl);
		}
	}
	const session = await getSession();

	res.setHeader(
		'Content-Security-Policy',
		`frame-ancestors https://${session?.shop} https://admin.shopify.com;`
	);

	return {
		session,
	};
}
export type Context = inferAsyncReturnType<typeof createContext>;
