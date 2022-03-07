import { ApolloClient, InMemoryCache } from "@apollo/client";

const URI = "http://172.18.222.238:4000/graphql";

export const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});
