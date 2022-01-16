import { Card, Page, Stack, TextContainer } from "@shopify/polaris";
import { useAppContext } from "../context/context";

const Index = () => {
  const { appContext, setAppContext } = useAppContext();

  const { name, myshopifyDomain, email } = appContext.shop;

  return (
    <Page title="Shopify app with Node and React 🎉">
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
      </Stack>
    </Page>
  );
};

export default Index;
