import {
  ApolloClient,
  concat,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN, REFRESH_TOKEN } from "./localKey";
import { getCookie } from "./utils/cookie";
import { onError } from "@apollo/client/link/error";
import { useRefreshToken } from "./hooks/refreshToken";

const URI = "http://192.168.219.100:4000/graphql";
const access_token = localStorage.getItem(LOCALSTORAGE_TOKEN);
const refresh_token =
  /*document.cookie
  .split(`${REFRESH_TOKEN}=`)[1]
  .split(";")[0];*/ getCookie(REFRESH_TOKEN);
export const jwtAccessTokenVar = makeVar(access_token);
export const jwtRefreshTokenVar = makeVar(refresh_token);
export const loggedInFlag = makeVar(Boolean(access_token));

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
      "x-jwt": jwtAccessTokenVar() || "",
      // "refresh-jwt": jwtRefreshTokenVar() || "",
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
              return jwtAccessTokenVar();
            },
          },
        },
      },
    },
  }),
});

const onCompleted = (data) => {
  const {
    refreshToken: { ok, access_token, refresh_token },
  } = data;
  if (ok && access_token && refresh_token) {
    localStorage.setItem(LOCALSTORAGE_TOKEN, access_token);
    jwtAccessTokenVar(access_token);
    jwtRefreshTokenVar(refresh_token);
    loggedInFlag(true);
  }
};

onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log("dsafadsf");
  if (graphQLErrors) {
    console.log(graphQLErrors);
    const [
      refreshTokenMutation,
      { data: refreshTokenMutationResult, loading },
    ] = useRefreshToken(onCompleted);
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        // Apollo Server sets code to UNAUTHENTICATED
        // when an AuthenticationError is thrown in a resolver
        case "UNAUTHENTICATED":
          if (!loading) {
            refreshTokenMutation({
              variables: {
                refreshTokenInput: {
                  refresh_token: jwtRefreshTokenVar(),
                },
              },
            });
          }
          // Modify the operation context with a new token
          const oldHeaders = operation.getContext().headers;
          console.log(jwtAccessTokenVar());
          operation.setContext({
            headers: {
              ...oldHeaders,
              "x-jwt": jwtAccessTokenVar(),
            },
          });
          // Retry the request, returning the new observable
          return forward(operation);
      }
    }
  }

  // To retry on network errors, we recommend the RetryLink
  // instead of the onError link. This just logs the error.
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});
