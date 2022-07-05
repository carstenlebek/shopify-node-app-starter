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

	const session = await Shopify.Utils.loadCurrentSession(req, res, true);

	if (isSessionActive(session)) {
		res.setHeader(
			'Content-Security-Policy',
			`frame-ancestors https://${session?.shop} https://admin.shopify.com;`
		);
		return { session };
	} else {
		return { session: undefined };
	}
}
export type Context = inferAsyncReturnType<typeof createContext>;
