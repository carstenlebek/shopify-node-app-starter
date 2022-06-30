import 'src/styles/globals.css';

import {
	ApolloClient,
	ApolloProvider,
	HttpLink,
	InMemoryCache,
} from '@apollo/client';

import { AppBridgeProvider } from '@components/providers/AppBridgeProvider';
import { GraphQLProvider } from '@components/providers/GraphQLProvider';
import { PolarisProvider } from '@components/providers/PolarisProvider';

function MyApp({ Component, pageProps }) {
	const client = new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({
			uri: `/api/graphql`,
			fetch: async (uri, options) => {
				const response = await fetch(uri, {
					redirect: 'follow',
					...options,
				});
				if (response.redirected) {
					window.location.href = response.url;
				}
				return response;
			},
		}),
	});

	return (
		<PolarisProvider>
			<AppBridgeProvider>
				<GraphQLProvider>
					<ApolloProvider client={client}>
						<Component {...pageProps} />
					</ApolloProvider>
				</GraphQLProvider>
			</AppBridgeProvider>
		</PolarisProvider>
	);
}

export default MyApp;
