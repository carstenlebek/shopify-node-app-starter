import { ApiRequest, NextApiResponse } from '@types';

import Shopify from '@lib/shopify';
import loadCurrentSession from '@shopify/shopify-api/dist/utils/load-current-session';

export default async function handler(req: ApiRequest, res: NextApiResponse) {
	const session = await loadCurrentSession(req, res, true);
	try {
		const response = await Shopify.Utils.graphqlProxy(req, res);
		res
			.status(200)
			.setHeader(
				'Content-Security-Policy',
				`frame-ancestors https://${session?.shop} https://admin.shopify.com;`
			)
			.send(response.body);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).send(err.message);
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
