import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import Shopify, { SessionInterface } from '@shopify/shopify-api';

import { inferAsyncReturnType } from '@trpc/server';
/* eslint-disable @typescript-eslint/no-unused-vars */
import isSessionActive from '@helpers/is-session-active';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
	// session: Session | null
}

// /**
//  * Inner function for `createContext` where we create the context.
//  * This is useful for testing when we don't want to mock Next.js' request/response
//  */
// export async function createContextInner(_opts: CreateContextOptions) {
//   return {};
// }

// export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

// /**
//  * Creates context for an incoming request
//  * @link https://trpc.io/docs/context
//  */
// export async function createContext(
//   opts: trpcNext.CreateNextContextOptions,
// ): Promise<Context> {
//   // for API-response caching see https://trpc.io/docs/caching

//   return await createContextInner({});
// }

export async function createContext({
	req,
	res,
}: trpcNext.CreateNextContextOptions): Promise<{
	session: SessionInterface | undefined;
}> {
	// Create your context based on the request object
	// Will be available as `ctx` in all your resolvers

	// This is just an example of something you'd might want to do in your ctx fn
	async function getSession() {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true);
		let shop = req.query.shop;

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
			} catch (e) {
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
