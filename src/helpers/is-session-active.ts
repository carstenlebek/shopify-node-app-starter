import { SessionInterface } from '@shopify/shopify-api';

export default function isSessionActive(
	session: SessionInterface | undefined
): boolean {
	if (session) {
		const scopesUnchanged = process.env.SCOPES === session.scope;
		if (
			scopesUnchanged &&
			session.accessToken &&
			(!session.expires || new Date(session.expires) >= new Date())
		) {
			return true;
		}
	}
	return false;
}
