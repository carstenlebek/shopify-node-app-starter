import { authenticatedFetch } from "@shopify/app-bridge-utils";

export default async function exampleFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return await fetchFunction(`/api/example`, {
    method: "GET",
  }).then((result) => result.json());
}
