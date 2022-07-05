import { Banner, Layout, Page } from '@shopify/polaris';
import { ReactNode, useMemo, useState } from 'react';

import { Provider } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';

/**
 * A component to configure App Bridge.
 * @desc A thin wrapper around AppBridgeProvider that provides the following capabilities:
 *
 * 1. Ensures that navigating inside the app updates the host URL.
 * 2. Configures the App Bridge Provider, which unlocks functionality provided by the host.
 *
 * See: https://shopify.dev/apps/tools/app-bridge/react-components
 */
export function AppBridgeProvider({ children }: { children: ReactNode }) {
	const router = useRouter();

	const urlParams = new URLSearchParams(router.asPath.split('?')[1]);

	const query = Object.fromEntries(urlParams);

	// The host may be present initially, but later removed by navigation.
	// By caching this in state, we ensure that the host is never lost.
	// During the lifecycle of an app, these values should never be updated anyway.
	// Using state in this way is preferable to useMemo.
	// See: https://stackoverflow.com/questions/60482318/version-of-usememo-for-caching-a-value-that-will-never-change
	const [appBridgeConfig] = useState(() => {
		let host = query.host;
		if (typeof window !== 'undefined') {
			if (host) {
				window.sessionStorage.setItem('__SHOPIFY_DEV_HOST', host);
			} else {
				let h = window.sessionStorage.getItem('__SHOPIFY_DEV_HOST');
				if (h) {
					host = h;
				}
			}
		}

		return {
			host,
			apiKey: process.env.SHOPIFY_API_KEY || '',
			forceRedirect: true,
		};
	});

	const history = useMemo(
		() => ({ replace: (previousRoute: string) => router.push(previousRoute) }),
		[router]
	);

	const clientRouter = useMemo(
		() => ({
			location: router.asPath,
			history,
		}),
		[router.asPath, history]
	);

	if (!process.env.SHOPIFY_API_KEY) {
		return (
			<Page narrowWidth>
				<Layout>
					<Layout.Section>
						<div style={{ marginTop: '100px' }}>
							<Banner title='Missing Shopify API key' status='critical'>
								Your app is running without the SHOPIFY_API_KEY environment
								variable. Please ensure that it is set when running or building
								your React app.
							</Banner>
						</div>
					</Layout.Section>
				</Layout>
			</Page>
		);
	}

	return (
		<Provider router={clientRouter} config={appBridgeConfig}>
			{children}
		</Provider>
	);
}
