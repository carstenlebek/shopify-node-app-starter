import { Button, Card, FormLayout, Page, TextField } from "@shopify/polaris";
import React, { useState } from "react";

export default function Installation() {
  const [shop, setShop] = useState("");

  return (
    <Page fullWidth>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card title="Install app" sectioned>
          <FormLayout>
            <TextField
              prefix="https://"
              suffix=".myshopify.com"
              value={shop}
              onChange={setShop}
            ></TextField>
            <Button
              fullWidth
              primary
              url={HOST + "/auth?shop=" + shop + ".myshopify.com"}
            >
              Install
            </Button>
          </FormLayout>
        </Card>
      </div>
    </Page>
  );
}
