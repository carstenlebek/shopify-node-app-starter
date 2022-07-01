import { GraphQLClient, RawRequestOptions } from 'graphql-request';
import { QueryKey, UseQueryResult, useQuery } from 'react-query';

import { GraphQLError } from 'graphql-request/dist/types';
import { Headers } from 'graphql-request/dist/types.dom';
import { Variables } from 'graphql-request';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

/**
 * A hook for querying admin data.
 * @desc A thin wrapper around `useAuthenticatedFetch` and `react-query`.
 * It is configured to make queries using the Shopify Admin GraphQL API.
 * See: https://react-query.tanstack.com/reference/useQuery
 *
 * @returns {Array} An array containing the query data, loading state, and error state.
 */
export const useShopifyQuery = <T>(
	key: QueryKey,
	query: string,
	variables?: Variables
) => {
	const authenticatedFetch = useAuthenticatedFetch();
	const graphQLClient = new GraphQLClient('/api/graphql', {
		fetch: authenticatedFetch,
	});

	return useQuery(
		key,
		async (): Promise<{
			data: T;
			extensions?: any;
			headers: Headers;
			errors?: GraphQLError[];
			status: number;
		}> => await graphQLClient.rawRequest(query, variables)
	);
};
