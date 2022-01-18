import { gql } from "@apollo/client";

export const getActiveSubscriptions = gql`
  {
    appInstallation {
      id
      activeSubscriptions {
        lineItems {
          id
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
        id
        name
        status
        test
        trialDays
        createdAt
      }
    }
  }
`;
