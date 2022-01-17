import { gql, useQuery } from "@apollo/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import exampleFetch from "../utils/exampleFetch";

const QUERY = gql`
  query {
    shop {
      name
      myshopifyDomain
      email
    }
  }
`;

const Context = createContext();

export function AppContext({ children }) {
  const app = useAppBridge();

  const [appContext, setAppContext] = useState({
    shop: { name: "", myshopifyDomain: "", email: "" },
    session: {
      id: "",
      shop: "",
      state: "",
      isOnline: "",
      accessToken: "",
      scope: "",
    },
  });
  const [loading, setLoading] = useState(true);

  const [fetchLoading, setFetchLoading] = useState(true);
  const getSession = () => {
    exampleFetch(app).then((result) => {
      console.log(result);
      setAppContext({ ...appContext, session: result });
      setFetchLoading(false);
    });
  };

  const { loading: queryLoading } = useQuery(QUERY, {
    onCompleted: (data) => setAppContext({ ...appContext, shop: data.shop }),
  });

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (!fetchLoading && !queryLoading) {
      setLoading(false);
    }
  }, [fetchLoading, queryLoading]);

  const value = useMemo(() => ({ appContext, setAppContext, loading }), [
    appContext,
  ]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppContext() {
  return useContext(Context);
}
