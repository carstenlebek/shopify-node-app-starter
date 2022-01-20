import Router, { useRouter } from "next/router";

import { RoutePropagator as AppBridgeRoutePropagator } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect } from "react";

const RoutePropagator = () => {
  const router = useRouter();
  const { asPath } = router;
  const app = useAppBridge();

  useEffect(() => {
    app.subscribe(Redirect.Action.APP, async (payload) => {
      await app.getState().then((data) => {
        console.log(data);
        if (!data.contextualSaveBar) {
          Router.push(payload.path);
          // console.log(`Added a history entry with the path: ${payload.path}`);
        } else {
          // console.log("Contextual Save Bar is open. Redirection is blocked.");
        }
      });
    });
  }, []);

  return app && asPath ? (
    <AppBridgeRoutePropagator location={asPath} app={app} />
  ) : null;
};

export default RoutePropagator;
