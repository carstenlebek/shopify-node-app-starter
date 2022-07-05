import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode, useState } from 'react';

import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import superjson from 'superjson';
import { trpc } from '@lib/utils/trpc';
import { useAuthenticatedFetch } from 'src/hooks';

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

export default function TrpcProvider({ children }: { children: ReactNode }) {
	const fetchFunction = useAuthenticatedFetch();
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			url: `${getBaseUrl()}/api/trpc`,
			// @ts-ignore
			fetch: fetchFunction,
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
			transformer: superjson,
		})
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
