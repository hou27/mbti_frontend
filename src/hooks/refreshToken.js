import { gql, useMutation } from "@apollo/client";
import {
  client,
  jwtAccessTokenVar,
  jwtRefreshTokenVar,
  loggedInFlag,
} from "../apollo";
import { LOCALSTORAGE_TOKEN, REFRESH_TOKEN } from "../localKey";
import { setCookie } from "../utils/cookie";

const REFRESH_TOKEN_MUTATION = gql`
  mutation refreshTokenMutation($refreshTokenInput: RefreshTokenInput!) {
    refreshToken(input: $refreshTokenInput) {
      ok
      error
      access_token
      refresh_token
    }
  }
`;

export async function getRefreshedAccessToken() {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshTokenInput: {
          refresh_token: jwtRefreshTokenVar(),
        },
      },
    });
    const {
      refreshToken: { ok, access_token, refresh_token, error },
    } = data;
    console.log(data);
    if (ok && access_token && refresh_token) {
      console.log("it works");
      localStorage.setItem(LOCALSTORAGE_TOKEN, access_token);
      localStorage.setItem(REFRESH_TOKEN, refresh_token);
      // setCookie(REFRESH_TOKEN, refresh_token, {
      //   path: "/",
      //   secure: true,
      //   httpOnly: true,
      // });
      jwtAccessTokenVar(access_token);
      jwtRefreshTokenVar(refresh_token);

      return access_token;
    } else {
      loggedInFlag(false);
      console.log(error);
    }
  } catch (error) {
    loggedInFlag(false);
    console.log(error);
    return error;
  }
}
