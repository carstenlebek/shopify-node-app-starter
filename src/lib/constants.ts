export const TOP_LEVEL_OAUTH_COOKIE = 'shopify_top_level_oauth';

export const UPSTASH_REDIS_HEADERS = {
	Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
	Accept: 'application/json',
	'Content-Type': 'application/json',
};
