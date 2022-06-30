import { NextRequest, NextResponse } from 'next/server';

import verifyRequest from '@middleware/verify-request';

export async function middleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith('/api/auth')) {
		return NextResponse.next();
	}

	const urlParams = new URLSearchParams(req.url.split('?')[1]);

	const query = Object.fromEntries(urlParams);

	const verifiedRequest = await verifyRequest(req, query);

	return verifiedRequest;
}

export const config = {
	matcher: '/api/:path*',
};
