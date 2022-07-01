import 'src/styles/globals.css';

import { AppBridgeProvider } from '@components/providers/AppBridgeProvider';
import { GraphQLProvider } from '@components/providers/GraphQLProvider';
import { PolarisProvider } from '@components/providers/PolarisProvider';

function MyApp({ Component, pageProps }) {
	return (
		<PolarisProvider>
			<AppBridgeProvider>
				<GraphQLProvider>
					<Component {...pageProps} />
				</GraphQLProvider>
			</AppBridgeProvider>
		</PolarisProvider>
	);
}

export default MyApp;
