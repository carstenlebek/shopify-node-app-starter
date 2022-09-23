import { NextRequest, NextResponse } from 'next/server';

import { Redis } from '@upstash/redis';
import verifyRequest from '@middleware/verify-request';

export async function middleware(req: NextRequest) {
	const urlParams = new URLSearchParams(req.url.split('?')[1]);
	const query = Object.fromEntries(urlParams);

	if (
		req.nextUrl.pathname.startsWith('/api/auth') ||
		req.nextUrl.pathname.startsWith('/api/webhooks')
	) {
		return NextResponse.next();
	}

	if (req.nextUrl.pathname.startsWith('/api')) {
		const verifiedRequest = await verifyRequest(req, query);

		return verifiedRequest;
	}

	if (query.shop) {
		const redis = new Redis({
			url: process.env.UPSTASH_REDIS_REST_URL as string,
			token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
		});
		const redisShop = await redis.get(query.shop);

		if (!redisShop || redisShop !== process.env.SCOPES) {
			return NextResponse.redirect(
				`${process.env.HOST}/api/auth/offline?shop=${query.shop}`
			);
		} else {
			return NextResponse.next({
				headers: {
					'Content-Security-Policy': `frame-ancestors https://${query.shop} https://admin.shopify.com;`,
				},
			});
		}
	} else {
		return NextResponse.next();
	}
}

export const config = {
	matcher: '/:path*',
};
