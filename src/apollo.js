import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

const URI = "http://172.18.211.221:4000/graphql";
export const loggedInFlag = makeVar(false);

export const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return loggedInFlag();
            },
          },
        },
      },
    },
  }),
});
