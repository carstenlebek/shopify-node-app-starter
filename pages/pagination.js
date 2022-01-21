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

// * To use the relay Pagination, you have to add type policies
// * of the resources you want to fetch to the Apollo Client in _app.js

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
  const { data, loading, fetchMore, networkStatus, previousData } = useQuery(
    GET_PRODUCT_VARIANTS,
    {
      variables: queryVariables,
      notifyOnNetworkStatusChange: true,
    }
  );

  // *  Prefetch next page for a better user experience
  // ! Quick page navigation can lead to API throttling
  useEffect(() => {
    // * Only set query data as display data,
    // * if the initial query is loading or
    // * the query is done.
    if (
      data?.productVariants.edges.length > 0 &&
      (networkStatus === 1 || networkStatus === 7)
    ) {
      setDisplayData(data);
    }
    if (data?.productVariants?.edges) {
      fetchMore({
        variables: {
          first: resultsPerPage,
          after: data.productVariants.edges.at(-1)?.cursor,
          last: null,
          before: null,
        },
      });
    }
  }, [data]);

  // * Handle data in state, to prevent an empty list
  const [displayData, setDisplayData] = useState({
    productVariants: { edges: [] },
  });

  return (
    <Page title="Pagination Demo" breadcrumbs={[{ content: "Back", url: "/" }]}>
      <Layout>
        <Layout.Section>
          <TextContainer>
            <p>
              This is a demo of a relay pagination with apollo client. To use
              this with other resources add a{" "}
              <TextStyle variation="code">typePolicy</TextStyle> to the Apollo
              cache in <TextStyle variation="code">_app.js</TextStyle>
            </p>
          </TextContainer>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <IndexTable
              resourceName={{ singular: "variant", plural: "variants" }}
              // * Set itemCount to 1 while loading to prevent empty state
              itemCount={
                networkStatus < 7
                  ? 1
                  : data && loading
                  ? 1
                  : data
                  ? data.productVariants.edges.length
                  : 1
              }
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
              {data?.productVariants &&
                displayData.productVariants.edges.map((variant) => {
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
                        last: resultsPerPage,
                        before: data.productVariants.edges[0].cursor,
                      },
                    });

                    // * Add the new query variables to the original query
                    // ! If the variables are not changed, data will not change
                    setQueryVariables((prev) => {
                      let obj = { ...prev };
                      obj.first = null;
                      obj.after = null;
                      obj.last = resultsPerPage;
                      obj.before = data.productVariants.edges[0].cursor;
                      return obj;
                    });
                  }}
                  onNext={() => {
                    // * Use fetchMore to utilize cache
                    // * The next page is already prefetched. Navigation should be quick and responsive
                    fetchMore({
                      variables: {
                        first: resultsPerPage,
                        after: data.productVariants.edges.at(-1).cursor,
                        last: null,
                        before: null,
                      },
                    });

                    // * Add the new query variables to the original query
                    // ! If the variables are not changed, data will not change
                    setQueryVariables((prev) => {
                      let obj = { ...prev };
                      obj.first = resultsPerPage;
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
        </Layout.Section>
      </Layout>
    </Page>
  );
}
