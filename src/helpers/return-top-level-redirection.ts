import { NextRequest, NextResponse } from 'next/server';

export default function returnTopLevelRedirection(
	req: NextRequest,
	redirectUrl: string
): NextResponse {
	const bearerPresent = req.headers.get('authorization')?.match(/Bearer (.*)/);

	// If the request has a bearer token, the app is currently embedded, and must break out of the iframe to
	// re-authenticate
	if (bearerPresent) {
		const res = new NextResponse(null, {
			headers: {
				'X-Shopify-API-Request-Failure-Reauthorize': '1',
				'X-Shopify-API-Request-Failure-Reauthorize-Url': `${process.env.HOST}/api/auth?shop=clebek.myshopify.com`,
			},
		});
		return res;
	} else {
		return NextResponse.redirect(redirectUrl);
	}
}
