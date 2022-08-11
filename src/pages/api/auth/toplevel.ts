import { ApiRequest, NextApiResponse } from '@types';

// @ts-ignore
import { CookieSerializeOptions, serialize } from 'cookie';
import Shopify from '@lib/shopify';
import { TOP_LEVEL_OAUTH_COOKIE } from '@lib/constants';
import topLevelAuthRedirect from '@helpers/top-level-auth-redirect';

interface NextResponse extends NextApiResponse {
	cookie(name: string, value: string, options?: CookieSerializeOptions): void;
}

export default async function handler(req: ApiRequest, res: NextResponse) {
	return res.setHeader('Set-Cookie', serialize(TOP_LEVEL_OAUTH_COOKIE, '1', {
		path: '/',
		maxAge: 900,
		httpOnly: true,
		secure: true
	}))
		.setHeader('Content-Type', 'text/html')
		.setHeader('Cache-Control', 'no-store')
		.send(
			topLevelAuthRedirect({
				apiKey: Shopify.Context.API_KEY,
				hostName: Shopify.Context.HOST_NAME,
				shop: req.query.shop,
			})
		);
}
