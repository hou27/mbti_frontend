import {
  ApolloClient,
  concat,
  createHttpLink,
  InMemoryCache,
  makeVar,
  from,
  fromPromise,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN, REFRESH_TOKEN } from "./localKey";
import { getCookie } from "./utils/cookie";
import { onError } from "@apollo/client/link/error";
import { getRefreshedAccessToken } from "./hooks/refreshToken";

const URI = "http://192.168.219.100:4000/graphql";
const access_token = localStorage.getItem(LOCALSTORAGE_TOKEN);
const refresh_token = localStorage.getItem(REFRESH_TOKEN);
/*document.cookie
  .split(`${REFRESH_TOKEN}=`)[1]
  .split(";")[0]; getCookie(REFRESH_TOKEN);*/
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
      authorization: jwtAccessTokenVar() ? `Bearer ${jwtAccessTokenVar()}` : "",
    },
  };
});

async function retryRequestWithNewToken(operation, forward) {
  const oldHeaders = operation.getContext().headers;
  const refreshed_access_token = await getRefreshedAccessToken();
  operation.setContext(() => {
    return {
      headers: {
        ...oldHeaders,
        authorization: refreshed_access_token
          ? `Bearer ${refreshed_access_token}`
          : "",
      },
    };
  });
  // Retry the request, returning the new observable
  console.log(operation.getContext().headers);
  forward(operation);
}

const linkOnError = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    console.log("on error works");
    if (graphQLErrors) {
      console.log(graphQLErrors);
      for (let err of graphQLErrors) {
        const errMsg = err.message;
        switch (errMsg) {
          // Apollo Server sets errMsg to jwt expired
          // when an AuthenticationError is thrown in a resolver
          case "jwt expired":
            // Modify the operation context with a new token
            retryRequestWithNewToken(operation, forward);
          /*
            const oldHeaders = operation.getContext().headers;
            operation.setContext(async () => {
              const refreshed_access_token = await getRefreshedAccessToken();
              return {
                headers: {
                  ...oldHeaders,
                  authorization: refreshed_access_token
                    ? `Bearer ${refreshed_access_token}`
                    : "",
                },
              };
            });
            // Retry the request, returning the new observable
            return forward(operation);
            */
        }
      }
    }

    // To retry on network errors, we recommend the RetryLink
    // instead of the onError link. This just logs the error.
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
);

export const client = new ApolloClient({
  // uri: URI,
  link: from([linkOnError, authLink.concat(httpLink)]),
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
