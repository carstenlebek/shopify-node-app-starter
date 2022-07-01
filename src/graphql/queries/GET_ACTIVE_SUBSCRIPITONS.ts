import { gql } from 'graphql-request';

export const GET_ACTIVE_SUBSCRIPTIONS = gql`
	query getActiveSubscriptions {
		appInstallation {
			activeSubscriptions {
				name
				status
				lineItems {
					plan {
						pricingDetails {
							... on AppRecurringPricing {
								__typename
								price {
									amount
									currencyCode
								}
								interval
							}
						}
					}
				}
				test
			}
		}
	}
`;
