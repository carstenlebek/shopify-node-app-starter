import { gql } from "@apollo/client";

export const GET_PRODUCT_VARIANTS = gql`
  query getProducts(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $sortKey: ProductVariantSortKeys
  ) {
    productVariants(
      first: $first
      after: $after
      last: $last
      before: $before
      sortKey: $sortKey
      reverse: true
    ) {
      edges {
        cursor
        node {
          id
          title
          sku
          inventoryPolicy
          inventoryQuantity
          product {
            title
            images(first: 1) {
              edges {
                node {
                  transformedSrc(maxHeight: 60, maxWidth: 60)
                  id
                  altText
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
