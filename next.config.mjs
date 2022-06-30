import * as envfile from 'envfile';
import * as ngrok from 'ngrok';

import { output, session } from '@shopify/cli-kit';
import path, { resolve } from 'path';
import { readFile, writeFileSync } from 'fs';

import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
import cli from './src/lib/shopifyCli.mjs';
import { fileURLToPath } from 'url';

const writeEnvToFile = (envVariables) => {
	const __filename = fileURLToPath(import.meta.url);

	const __dirname = path.dirname(__filename);
	// get `.env` from path of current directory
	const envPath = resolve(__dirname, '.env');
	readFile(envPath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const parsedFile = envfile.parse(data);
		envVariables.forEach((envVar) => {
			if (envVar.key && envVar.value) {
				parsedFile[envVar.key] = envVar.value;
			}
		});
		writeFileSync(envPath, envfile.stringify(parsedFile));
	});
};

async function setEnvironmentAndReturnHost() {
	const token = await session.ensureAuthenticatedPartners();

	const orgId = await cli.selectOrg(token);

	const app = await cli.fetchAppFromApiKey(process.env.SHOPIFY_API_KEY, token);

	const store = cli.removeHttp(process.env.SHOP);

	const tunnelUrl = await ngrok.connect({
		addr: 3000,
		authtoken: process.env.NGROK_AUTH_TOKEN,
	});

	if (tunnelUrl) {
		writeEnvToFile([{ key: 'HOST', value: tunnelUrl }]);
		output.info(output.content`\n\nNgrok tunnel is running\n`);
		await cli.updateURLs(app.apiKey, tunnelUrl);
		cli.outputAppURL(true, store, tunnelUrl);
	}

	return tunnelUrl;
}

const nextConfig = async (phase) => {
	let HOST = process.env.HOST;
	let SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		HOST = await setEnvironmentAndReturnHost();
	}
	/**
	 * @type {import('next').NextConfig}
	 */
	return {
		reactStrictMode: true,
		/* config options here */
		env: {
			HOST,
			SHOPIFY_API_KEY,
		},
	};
};

export default nextConfig;
