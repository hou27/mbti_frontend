import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN } from "./localToken";

const URI = "http://192.168.219.100:4000/graphql";
const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const jwtTokenVar = makeVar(token);
export const loggedInFlag = makeVar(Boolean(token));

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://mbti-others-backend.herokuapp.com/graphql"
      : URI,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": jwtTokenVar() || "",
    },
  };
});

export const client = new ApolloClient({
  // uri: URI,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return loggedInFlag();
            },
          },
          token: {
            read() {
              return jwtTokenVar();
            },
          },
        },
      },
    },
  }),
});
