import { api, error as kitError, output, session, ui } from '@shopify/cli-kit';

export async function selectOrganizationPrompt(organizations) {
	if (organizations.length === 1) {
		return organizations[0];
	}
	const orgList = organizations.map((org) => ({
		name: org.businessName,
		value: org.id,
	}));
	const choice = await ui.prompt([
		{
			type: 'autocomplete',
			name: 'id',
			message: 'Which Partners organization is this work for?',
			choices: orgList,
		},
	]);
	return organizations.find((org) => org.id === choice.id);
}

const NoOrgError = (organizationId) => {
	const nextSteps = [
		output.content`Have you ${output.token.link(
			'created a Shopify Partners organization',
			'https://partners.shopify.com/signup'
		)}?`,
		output.content`Have you confirmed your accounts from the emails you received?',
    )}`,
		output.content`Need to connect to a different App or organization? Run the command again with ${output.token.genericShellCommand(
			'--reset'
		)}`,
		output.content`Do you have access to the right Shopify Partners organization? The CLI is loading ${output.token.link(
			'this organization',
			`https://partner.shopify.com/${organizationId}`
		)}`,
	];
	return new error.Abort(
		`No Organization found`,
		nextSteps
			.map((content) => `· ${output.stringifyMessage(content)}`)
			.join('\n')
	);
};

export const InvalidApiKeyError = (apiKey) => {
	return new kitError.Abort(
		output.content`Invalid API key: ${apiKey}`,
		output.content`You can find the API key in the app settings in the Partner Dashboard.`
	);
};

export async function fetchOrganizations(token) {
	const query = api.graphql.AllOrganizationsQuery;
	const result = await api.partners.request(query, token);
	const organizations = result.organizations.nodes;
	if (organizations.length === 0) throw NoOrgError();
	return organizations;
}

export async function selectOrg(token) {
	const orgs = await fetchOrganizations(token);
	const org = await selectOrganizationPrompt(orgs);
	return org.id;
}

export async function fetchAppFromApiKey(apiKey, token) {
	const res = await api.partners.request(api.graphql.FindAppQuery, token, {
		apiKey,
	});
	return res.app;
}

export async function updateURLs(apiKey, url) {
	const token = await session.ensureAuthenticatedPartners();

	const variables = {
		apiKey,
		appUrl: url,
		redir: [
			`${url}/api/auth`,
			`${url}/api/auth/callback`,
			`${url}/api/auth/offline`,
			`${url}/api/auth/offline-callback`,
			`${url}/api/auth/toplevel`,
		],
	};

	const query = api.graphql.UpdateURLsQuery;
	const result = await api.partners.request(query, token, variables);
	if (result.appUpdate.userErrors.length > 0) {
		const errors = result.appUpdate.userErrors
			.map((error) => error.message)
			.join(', ');
		throw new kitError.Abort(errors);
	}
}

function buildAppURL(storeFqdn, publicURL) {
	const hostUrl = `${storeFqdn}/admin`;
	const hostParam = btoa(hostUrl).replace(/[=]/g, '');
	return `${publicURL}/?shop=${storeFqdn}&host=${hostParam}`;
}

export function outputAppURL(updated, storeFqdn, url) {
	const appURL = buildAppURL(storeFqdn, url);
	const heading = output.token.heading('App URL');
	let message = `Once everything's built, your app's shareable link will be:\n${appURL}`;
	if (updated) {
		message += `\nNote that your app's URL in Shopify Partners will be updated.`;
	}

	output.info(output.content`\n\n${heading}\n${message}\n`);
}

export function removeHttp(url) {
	if (url.startsWith('https://')) {
		const https = 'https://';
		return url.slice(https.length);
	}

	if (url.startsWith('http://')) {
		const http = 'http://';
		return url.slice(http.length);
	}

	return url;
}

let cli = {};
cli.fetchAppFromApiKey = fetchAppFromApiKey;
cli.outputAppURL = outputAppURL;
cli.removeHttp = removeHttp;
cli.selectOrg = selectOrg;
cli.updateURLs = updateURLs;

export default cli;
