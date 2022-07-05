import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from 'react-query';

import { ReactNode } from 'react';

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
export function GraphQLProvider({ children }: { children: ReactNode }) {
	const client = new QueryClient({
		queryCache: new QueryCache(),
		mutationCache: new MutationCache(),
	});

	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
