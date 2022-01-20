import { Button, Card, Page, Stack, TextContainer } from "@shopify/polaris";

import AppLoader from "../components/AppLoader";
import Link from "next/link";
import { useAppContext } from "../context/context";

const Index = () => {
  const { appContext } = useAppContext();

  const { name, myshopifyDomain, email } = appContext.shop;

  const { id, shop, state, isOnline, accessToken, scope } = appContext.session;

  return (
    <Page
      title="Shopify app with Node and React 🎉"
      primaryAction={{ content: "Plans", url: "/subscription" }}
    >
      <Stack vertical>
        <Card sectioned title="Shopname">
          <TextContainer>{name}</TextContainer>
        </Card>
        <Card sectioned title=".myshopify URL">
          <TextContainer>{myshopifyDomain}</TextContainer>
        </Card>
        <Card sectioned title="Email address">
          <TextContainer>{email}</TextContainer>
        </Card>
        <Card title="Session" sectioned>
          <p>{id}</p>
          <p>{shop}</p>
          <p>{state}</p>
          <p>{isOnline}</p>
          <p>{accessToken}</p>
          <p>{scope}</p>
        </Card>
        <Link href="/pagination">
          <Button fullWidth primary>
            Pagination Demo
          </Button>
        </Link>
      </Stack>
    </Page>
  );
};

export default Index;
