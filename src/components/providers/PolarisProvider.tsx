import '@shopify/polaris/build/esm/styles.css';

import { AppProvider } from '@shopify/polaris';
import Link from 'next/link';
import { ReactNode } from 'react';
import translations from '@shopify/polaris/locales/en.json';

function AppBridgeLink({
	url,
	children,
	external,
	...rest
}: {
	url: string;
	children?: ReactNode;
	external?: boolean;
}) {
	const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

	if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
		return (
			<a target='_blank' rel='noopener noreferrer' href={url} {...rest}>
				{children}
			</a>
		);
	}

	return (
		<Link href={url} {...rest}>
			<a {...rest}>{children}</a>
		</Link>
	);
}

/**
 * Sets up the AppProvider from Polaris.
 * @desc PolarisProvider passes a custom link component to Polaris.
 * The Link component handles navigation within an embedded app.
 * Prefer using this vs any other method such as an anchor.
 *
 * PolarisProvider also passes translations to Polaris.
 *
 */
export function PolarisProvider({ children }: { children: ReactNode }) {
	return (
		<AppProvider i18n={translations} linkComponent={AppBridgeLink}>
			{children}
		</AppProvider>
	);
}
