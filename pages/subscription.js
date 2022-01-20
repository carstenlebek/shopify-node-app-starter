import {
  Card,
  Layout,
  Page,
  Spinner,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import React, { useState } from "react";
import {
  appSubscriptionCancel,
  appSubscriptionCreate,
} from "../billing/mutations";
import { useMutation, useQuery } from "@apollo/client";

import { Redirect } from "@shopify/app-bridge/actions";
import { getActiveSubscriptions } from "../billing/queries";
import { returnURlBuilder } from "../utils/returnUrlBuilder";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useAppContext } from "../context/context";

export default function Subscription() {
  const { appContext } = useAppContext();
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const { myshopifyDomain } = appContext.shop;

  const returnUrl = returnURlBuilder(myshopifyDomain);

  const [createAppSubscription] = useMutation(appSubscriptionCreate);

  const handleCreateSubscription = () => {
    createAppSubscription({
      variables: {
        name: "Test",
        returnUrl: returnUrl,
        trialDays: 14,
        test: true,
        interval: "EVERY_30_DAYS",
        amount: 10,
      },
      onCompleted: (data) => {
        redirect.dispatch(
          Redirect.Action.REMOTE,
          data.appSubscriptionCreate.confirmationUrl
        );
      },
      onError: (error) => console.log(error),
    });
  };

  const [activeSubscription, setActiveSubscription] = useState(null);
  const { data, loading } = useQuery(getActiveSubscriptions, {
    onCompleted: (data) => {
      setActiveSubscription(data.appInstallation.activeSubscriptions[0]);
    },
  });

  const [cancelAppSubscription] = useMutation(appSubscriptionCancel);

  const handleCancelSubscription = () => {
    cancelAppSubscription({
      variables: {
        id: activeSubscription?.id,
      },
      onCompleted: (data) => console.log(data),
      onError: (error) => console.log(error),
    });
  };

  return (
    <Page title="Subscriptions" breadcrumbs={[{ content: "Back", url: "/" }]}>
      <Layout sectioned>
        <Card
          sectioned
          title="Create an app subscription"
          primaryFooterAction={{
            content: "Create",
            onAction: handleCreateSubscription,
          }}
        >
          <TextContainer>
            <p>
              Click on the button to create a test subscription for a plan for
              $10/month with a 14 day trial
            </p>
          </TextContainer>
        </Card>
        <Card
          sectioned
          title="Currently Active Subscription"
          primaryFooterAction={
            data?.appInstallation.activeSubscriptions[0] && {
              content: "Cancel Subscription",
              destructive: true,
              onAction: handleCancelSubscription,
            }
          }
        >
          {loading ? (
            <Spinner />
          ) : !data.appInstallation.activeSubscriptions[0] ? (
            <TextContainer>
              <p>No active subscription.</p>
            </TextContainer>
          ) : (
            <Stack distribution="equalSpacing" alignment="center">
              {activeSubscription && (
                <TextContainer>
                  <p>Name: {activeSubscription.name}</p>
                  <p>Created at: {activeSubscription.createdAt}</p>
                  <p>Id: {activeSubscription.id}</p>
                  <p>Status: {activeSubscription.status}</p>
                  <p>Trialdays: {activeSubscription.trialDays}</p>
                  <p>
                    Price:{" "}
                    {
                      activeSubscription.lineItems[0].plan.pricingDetails.price
                        .amount
                    }{" "}
                    {
                      activeSubscription.lineItems[0].plan.pricingDetails.price
                        .currencyCode
                    }
                  </p>
                  <p>Test: {activeSubscription.test.toString()}</p>
                </TextContainer>
              )}
            </Stack>
          )}
        </Card>
      </Layout>
    </Page>
  );
}
