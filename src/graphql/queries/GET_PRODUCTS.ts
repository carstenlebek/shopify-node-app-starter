import { gql } from 'graphql-request';

export const GET_PRODUCTS = gql`
	query getProducts($first: Int) {
		products(first: $first) {
			nodes {
				id
				title
				priceRangeV2 {
					maxVariantPrice {
						amount
						currencyCode
					}
					minVariantPrice {
						amount
						currencyCode
					}
				}
			}
		}
	}
`;
