import "@shopify/polaris/build/esm/styles.css";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { AppContext, useAppContext } from "../context/context";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import {
  relayPaginationMerge,
  relayPaginationRead,
} from "../utils/relayPagination";

import App from "next/app";
import AppLoader from "../components/AppLoader";
import { AppProvider } from "@shopify/polaris";
import Link from "next/link";
import { Redirect } from "@shopify/app-bridge/actions";
import RoutePropagator from "../utils/routepropagator";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import translations from "@shopify/polaris/locales/en.json";

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

function MyProvider(props) {
  const app = useAppBridge();

  // * Add type policies to Apollo Client like in the following example.

  const client = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            productVariants: {
              keyArgs: false,
              merge: relayPaginationMerge,
              read: relayPaginationRead,
            },
          },
        },
      },
    }),
    link: new createHttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
      headers: {
        "Content-Type": "application/graphql",
      },
    }),
  });

  return (
    <ApolloProvider client={client}>
      <AppContext host={props.host}>
        <AppInitializer {...props} />
      </AppContext>
    </ApolloProvider>
  );
}

function AppInitializer(props) {
  const { loading } = useAppContext();

  if (loading) return <AppLoader />;

  const Component = props.Component;

  return <Component {...props} />;
}

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

function LinkComponent({ children, url = "", external, ref, ...rest }) {
  // * The Link component evaluates all 'a' tags

  // * If the 'a' tags href is an external url, everything stays the same

  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    rest.target = "_blank";
    rest.rel = "noopener noreferrer";
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  // * If the href is a relative path next/link will be used for routing

  return (
    <Link href={url}>
      <div {...rest}>{children}</div>
    </Link>
  );
}

class MyApp extends App {
  render() {
    const { Component, pageProps, host } = this.props;

    // TODO: Find a way to display an installation page

    // if (!host)
    //   return (
    //     <AppProvider i18n={translations}>
    //       <Component {...pageProps} />
    //     </AppProvider>
    //   );

    return (
      <AppProvider i18n={translations} linkComponent={LinkComponent}>
        <Provider
          config={{
            apiKey: API_KEY,
            host: host,
            forceRedirect: true,
          }}
        >
          <MyProvider Component={Component} host={host} {...pageProps} />
          <RoutePropagator />
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  };
};

export default MyApp;
