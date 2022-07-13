import { ApiRequest, NextApiResponse } from '@types';

import { Redis } from '@upstash/redis';
import Shopify from '@lib/shopify';

const SESSION_COOKIE_NAME = 'shopify_app_session';

export default async function handler(req: ApiRequest, res: NextApiResponse) {
	try {
		const session = await Shopify.Auth.validateAuthCallback(
			req,
			res,
			req.query
		);

		const redis = new Redis({
			url: process.env.UPSTASH_REDIS_REST_URL as string,
			token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
		});

		const redisShop = await redis.get(session.shop);

		if (!redisShop || redisShop !== process.env.SCOPES) {
			await redis.set(session.shop, session.scope);
			// You can do your app setup here, e.g. creating a
			// db entry.
		}

		const webhooks = await Shopify.Webhooks.Registry.registerAll({
			shop: session.shop,
			accessToken: session.accessToken as string,
		});

		Object.keys(webhooks).forEach((webhook) => {
			if (webhooks[webhook].success === true) {
				console.log(`Registered ${webhook} webhook`);
			} else {
				console.log(
					`Failed to register ${webhook} webhook: ${webhooks.result}`
				);
			}
		});

		res.setHeader(
			'Set-Cookie',
			SESSION_COOKIE_NAME + '=' + session.id + '; 0; Path=/; HttpOnly; Secure'
		);

		if (
			process.env.NODE_ENV === 'development' ||
			process.env.USE_OFFLINE_ACCESS_TOKEN === 'true'
		) {
			res.redirect(
				`/api/auth/offline?host=${req.query.host}&shop=${req.query.shop}`
			);
		} else {
			res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`);
		}
	} catch (e: any) {
		console.warn(e);
		switch (true) {
			case e instanceof Shopify.Errors.InvalidOAuthError:
				res.status(400);
				res.send(e.message);
				break;
			case e instanceof Shopify.Errors.CookieNotFound:
			case e instanceof Shopify.Errors.SessionNotFound:
				// This is likely because the OAuth session cookie expired before the merchant approved the request
				res.redirect(`/api/auth?shop=${req.query.shop}`);
				break;
			default:
				res.status(500);
				res.send(e.message);
				break;
		}
	}
}
