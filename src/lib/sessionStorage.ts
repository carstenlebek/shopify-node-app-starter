import Shopify, { SessionInterface } from '@shopify/shopify-api';

import { UPSTASH_REDIS_HEADERS } from './constants';
import fetch from 'node-fetch';

const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;

const headers = UPSTASH_REDIS_HEADERS;

const storeCallback = async (session: SessionInterface): Promise<boolean> => {
	// @ts-ignore
	const { result } = await fetch(
		`${upstashRedisRestUrl}/set/${session.id}${
			!session.id.includes('offline') ? '?EX=300' : ''
		}`,
		{
			method: 'POST',
			headers,
			body: JSON.stringify(session),
		}
	).then((res) => res.json());

	return result === 'OK';
};

const loadCallback = async (id: string): Promise<SessionInterface> => {
	// @ts-ignore
	const { result } = await fetch(`${upstashRedisRestUrl}/get/${id}`, {
		method: 'GET',
		headers,
	}).then((res) => res.json());

	return JSON.parse(result);
};

const deleteCallback = async (id: string): Promise<boolean> => {
	// @ts-ignore
	const { result } = await fetch(`${upstashRedisRestUrl}/getdel/${id}`, {
		method: 'GET',
		headers,
	}).then((res) => res.json());

	return !!result;
};

const SessionStorage = new Shopify.Session.CustomSessionStorage(
	storeCallback,
	loadCallback,
	deleteCallback
);

export default SessionStorage;
