import { AppBridgeProvider } from '@components/providers/AppBridgeProvider';
import { AppRouter } from '@server/routers/_app';
import { GraphQLProvider } from '@components/providers/GraphQLProvider';
import { PolarisProvider } from '@components/providers/PolarisProvider';
import { SSRContext } from '@lib/utils/trpc';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import superjson from 'superjson';
import { withTRPC } from '@trpc/next';

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

function getBaseUrl() {
	if (typeof window !== 'undefined') {
		return '';
	}
	// reference for vercel.com
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// assume ngrok tunnel
	return process.env.HOST;
}

export default withTRPC<AppRouter>({
	config() {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		return {
			/**
			 * @link https://trpc.io/docs/links
			 */
			links: [
				// adds pretty logs to your console in development and logs errors in production
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === 'development' ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
			/**
			 * @link https://trpc.io/docs/data-transformers
			 */
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: true,
	/**
	 * Set headers or status code when doing SSR
	 */
	responseMeta(opts) {
		const ctx = opts.ctx as SSRContext;

		if (ctx.status) {
			// If HTTP status set, propagate that
			return {
				status: ctx.status,
			};
		}

		const error = opts.clientErrors[0];
		if (error) {
			// Propagate http first error from API calls
			return {
				status: error.data?.httpStatus ?? 500,
			};
		}
		// For app caching with SSR see https://trpc.io/docs/caching
		return {};
	},
})(MyApp);
