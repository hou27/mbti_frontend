import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "./localToken";

const URI = "http://172.18.211.221:4000/graphql";
export const loggedInFlag = makeVar(false);
const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const jwtTokenVar = makeVar(token);

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
