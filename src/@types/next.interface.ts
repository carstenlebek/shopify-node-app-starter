import type { NextApiRequest } from 'next';

export interface ApiRequest extends NextApiRequest {
	query: {
		code: string;
		timestamp: string;
		state: string;
		shop: string;
		host?: string;
		hmac?: string;
		sessionToken?: string;
		auth?: string;
	};
}
