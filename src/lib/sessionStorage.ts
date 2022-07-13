import Shopify, { SessionInterface } from '@shopify/shopify-api';

import { Redis } from '@upstash/redis';

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL as string,
	token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const storeCallback = async (session: SessionInterface): Promise<boolean> => {
	const result = await redis.set(
		session.id,
		JSON.stringify(session),
		session.id.includes('offline') ? {} : { ex: 36000 }
	);

	return result === 'OK';
};

const loadCallback = async (
	id: string
): Promise<SessionInterface | { [key: string]: unknown } | undefined> => {
	const result = await redis.get<Promise<SessionInterface | null>>(id);

	return result ? result : undefined;
};

const deleteCallback = async (id: string): Promise<boolean> => {
	const result = await redis.del(id);

	return result > 0;
};

const SessionStorage = new Shopify.Session.CustomSessionStorage(
	storeCallback,
	loadCallback,
	deleteCallback
);

export default SessionStorage;
