import { ApiRequest, NextApiResponse } from '@types';

// @ts-ignore
import { CookieSerializeOptions } from 'cookie';
import Shopify from '@lib/shopify';
import { TOP_LEVEL_OAUTH_COOKIE } from '@lib/constants';
import topLevelAuthRedirect from '@helpers/top-level-auth-redirect';

interface NextResponse extends NextApiResponse {
	cookie(name: string, value: string, options?: CookieSerializeOptions): void;
}

export default async function handler(req: ApiRequest, res: NextResponse) {
	res.setHeader(
		'Set-Cookie',
		TOP_LEVEL_OAUTH_COOKIE + '=1; 0; Path=/; Max-Age=900; HttpOnly; Secure'
	);

	console.log('Toplevel', req.query);

	console.log(res.getHeaders());
	res.setHeader('Content-Type', 'text/html');

	return res.send(
		topLevelAuthRedirect({
			apiKey: Shopify.Context.API_KEY,
			hostName: Shopify.Context.HOST_NAME,
			shop: req.query.shop,
		})
	);
}
