import {
  Card,
  IndexTable,
  Layout,
  Page,
  Pagination,
  Stack,
  TextContainer,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";

import { GET_PRODUCT_VARIANTS } from "../pagination/queries/GET_PRODUCT_VARIANTS";
import { useQuery } from "@apollo/client";

export default function PaginationExample() {
  // * Set results per page
  const resultsPerPage = 5;

  // * Store query variables in state, so they can be changed
  const [queryVariables, setQueryVariables] = useState({
    first: resultsPerPage,
    after: null,
    last: null,
    before: null,
  });

  // * Start initial query
  const { data, loading, fetchMore } = useQuery(GET_PRODUCT_VARIANTS, {
    variables: queryVariables,
  });

  // *  Prefetch next page for a better user experience
  // ! Quick page navigation can lead to API throttling
  useEffect(() => {
    if (data) {
      fetchMore({
        variables: {
          first: resultsPerPage,
          after: data.productVariants.at(-1).cursor,
          last: null,
          before: null,
        },
      });
    }
  }, [data]);

  return (
    <Page title="Pagination Demo">
      <Layout sectioned>
        <TextContainer>
          <p>
            This is a demo of a relay pagination with apollo client. To use this
            with other resources add a{" "}
            <TextStyle variation="code">typePolicy</TextStyle> to the Apollo
            cache in <TextStyle variation="code">_app.js</TextStyle>
          </p>
        </TextContainer>
        <Card>
          <IndexTable
            resourceName={{ singular: "variant", plural: "variants" }}
            itemCount={data ? data.productVariants.edges.length : 0}
            headings={[
              { title: "Product image", hidden: true },
              { title: "Product" },
              { title: "SKU" },
              { title: "Inventory" },
              { title: "When sold out" },
            ]}
            selectable={false}
            loading={loading}
          >
            {data &&
              data.productVariants.edges.map((variant) => {
                const {
                  id,
                  sku,
                  product,
                  title,
                  inventoryPolicy,
                  inventoryQuantity,
                } = variant.node;
                return (
                  <IndexTable.Row key={id}>
                    <IndexTable.Cell>
                      <Thumbnail
                        source={product.images.edges[0].node.transformedSrc}
                        alt={product.images.edges[0].node.altText}
                      />
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Stack vertical spacing="extraTight">
                        <TextStyle variation="strong">
                          {product.title}
                        </TextStyle>
                        {title !== "Default Title" && (
                          <TextStyle variation="strong">{title}</TextStyle>
                        )}
                      </Stack>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      {sku ? (
                        sku
                      ) : (
                        <TextStyle variation="subdued">No SKU</TextStyle>
                      )}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      {inventoryQuantity.toString()}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Stack vertical spacing="baseTight">
                        <p>
                          {inventoryPolicy === "DENY"
                            ? "Stop selling"
                            : "Keep selling"}
                        </p>
                      </Stack>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                );
              })}
          </IndexTable>
          <Card.Section>
            <Stack distribution="center">
              <Pagination
                hasPrevious={
                  data?.productVariants &&
                  data.productVariants.pageInfo.hasPreviousPage
                }
                hasNext={
                  data?.productVariants &&
                  data.productVariants.pageInfo.hasNextPage
                }
                onPrevious={() => {
                  // * Use fetchMore to utilize cache
                  fetchMore({
                    variables: {
                      first: null,
                      after: null,
                      last: 5,
                      before: data.productVariants.edges[0].cursor,
                    },
                  });

                  // * Add the new query variables to the original query
                  // ! If the variables are not changed, data will not change
                  setQueryVariables((prev) => {
                    let obj = { ...prev };
                    obj.first = null;
                    obj.after = null;
                    obj.last = 5;
                    obj.before = data.productVariants.edges[0].cursor;
                    return obj;
                  });
                }}
                onNext={() => {
                  // * Use fetchMore to utilize cache
                  // * The next page is already prefetched. Navigation should be quick and responsive
                  fetchMore({
                    variables: {
                      first: 5,
                      after: data.productVariants.edges.at(-1).cursor,
                      last: null,
                      before: null,
                    },
                  });

                  // * Add the new query variables to the original query
                  // ! If the variables are not changed, data will not change
                  setQueryVariables((prev) => {
                    let obj = { ...prev };
                    obj.first = 5;
                    obj.after = data.productVariants.edges.at(-1).cursor;
                    obj.last = null;
                    obj.before = null;
                    return obj;
                  });
                }}
              ></Pagination>
            </Stack>
          </Card.Section>
        </Card>
      </Layout>
    </Page>
  );
}
