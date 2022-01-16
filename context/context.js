import { gql, useQuery } from "@apollo/client";
import { createContext, useContext, useState, useMemo } from "react";

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
  const [appContext, setAppContext] = useState({
    shop: { name: "", myshopifyDomain: "", email: "" },
  });

  const value = useMemo(() => ({ appContext, setAppContext }), [appContext]);

  useQuery(QUERY, {
    onCompleted: (data) => setAppContext(data),
  });

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppContext() {
  return useContext(Context);
}
