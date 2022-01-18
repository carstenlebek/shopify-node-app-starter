import { gql } from "@apollo/client";

export const appSubscriptionCreate = gql`
  mutation CreateSubscription(
    $name: String!
    $returnUrl: URL!
    $trialDays: Int
    $test: Boolean
    $interval: AppPricingInterval
    $amount: Decimal!
  ) {
    appSubscriptionCreate(
      name: $name
      returnUrl: $returnUrl
      trialDays: $trialDays
      test: $test
      lineItems: {
        plan: {
          appRecurringPricingDetails: {
            price: { amount: $amount, currencyCode: USD }
            interval: $interval
          }
        }
      }
    ) {
      confirmationUrl
      appSubscription {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;
