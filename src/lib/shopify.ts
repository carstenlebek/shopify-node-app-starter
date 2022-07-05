// @ts-nocheck

import SessionStorage from './sessionStorage';
import Shopify from '@shopify/shopify-api';
import webhooks from '../webhooks';

Shopify.Context.initialize({
	API_KEY: process.env.SHOPIFY_API_KEY,
	API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
	SCOPES: process.env.SCOPES.split(','),
	HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
	HOST_SCHEME: process.env.HOST.split('://')[0],
	IS_EMBEDDED_APP: true,
	API_VERSION: process.env.SHOPIFY_API_VERSION,
	SESSION_STORAGE: SessionStorage,
});

Shopify.Webhooks.Registry.addHandlers(webhooks);

export default Shopify;
