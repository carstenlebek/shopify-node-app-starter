import { Heading, Spinner, Stack } from "@shopify/polaris";

import React from "react";

export default function AppLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <Stack vertical alignment="center" distribution="center">
        <Spinner size="large" />
        <Heading>Initializing app</Heading>
      </Stack>
    </div>
  );
}
