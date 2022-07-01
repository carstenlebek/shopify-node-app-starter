import { ApiRequest, NextApiResponse } from '@types';

import Shopify from '@lib/shopify';
import { TOP_LEVEL_OAUTH_COOKIE } from '@lib/constants';

export default async function handler(req: ApiRequest, res: NextApiResponse) {
	const shop = req.query.shop;

	console.log('API AUTH');

	if (!shop) {
		res.status(500);
		res.send('No shop provided');
	}

	if (!req.cookies[TOP_LEVEL_OAUTH_COOKIE]) {
		res.setHeader('Content-Type', 'text/html');
		return res.redirect(`/api/auth/toplevel?shop=${req.query.shop}`);
	}

	const redirectUrl = await Shopify.Auth.beginAuth(
		req,
		res,
		req.query.shop,
		'/api/auth/offline-callback',
		false
	);

	return res.redirect(redirectUrl);
}
