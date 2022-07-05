import { AppBridgeProvider } from '@components/providers/AppBridgeProvider';
import { AppContextProvider } from '@components/providers/AppContext';
import { AppProps } from 'next/app';
import { GraphQLProvider } from '@components/providers/GraphQLProvider';
import { PolarisProvider } from '@components/providers/PolarisProvider';
import TrpcProvider from '@components/providers/TrpcProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<PolarisProvider>
			<AppBridgeProvider>
				<GraphQLProvider>
					<TrpcProvider>
						<AppContextProvider>
							<Component {...pageProps} />
						</AppContextProvider>
					</TrpcProvider>
				</GraphQLProvider>
			</AppBridgeProvider>
		</PolarisProvider>
	);
}
