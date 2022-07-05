import { GraphQLClient } from 'graphql-request';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

/**
 * A hook for querying and mutating admin data.
 * @desc A thin wrapper around `useAuthenticatedFetch`.
 * It is configured to be passed to `@graphql-codegen` as a custom fetchfunction
 * to generate hooks to make queries using the Shopify Admin GraphQL API.
 * See: https://react-query.tanstack.com/reference/useQuery
 *
 * @returns {Array} An array containing the query data, loading state, and error state.
 */
export const useShopifyApi = <TData, TVariables>(
	query: string
): ((variables: TVariables | undefined) => Promise<TData>) => {
	const authenticatedFetch = useAuthenticatedFetch();
	const graphQLClient = new GraphQLClient('/api/graphql', {
		fetch: authenticatedFetch,
	});

	return async (variables) => {
		return (await graphQLClient.rawRequest(query, variables)).data;
	};
};
