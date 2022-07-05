import * as envfile from 'envfile';

import path, { resolve } from 'path';
import { readFile, writeFileSync } from 'fs';

import { fileURLToPath } from 'url';

export const writeEnvToFile = (
	envVariables: { key: string; value: string }[]
) => {
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
		console.log(parsedFile);
		writeFileSync(envPath, envfile.stringify(parsedFile));
	});
};
