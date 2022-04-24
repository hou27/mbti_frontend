import { gql, useMutation } from "@apollo/client";
import { jwtAccessTokenVar, jwtRefreshTokenVar } from "../apollo";
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

export const GetNewToken = () => {
  const onCompleted = (data) => {
    const {
      refreshToken: { ok, access_token, refresh_token },
    } = data;
    if (ok && access_token && refresh_token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, access_token);
      localStorage.setItem(REFRESH_TOKEN, refresh_token);
      // setCookie(REFRESH_TOKEN, refresh_token, {
      //   path: "/",
      //   secure: true,
      //   httpOnly: true,
      // });
      jwtAccessTokenVar(access_token);
      jwtRefreshTokenVar(refresh_token);
      // loggedInFlag(true);
      return access_token;
    }
  };

  const [refreshTokenMutation, { data: refreshTokenMutationResult, loading }] =
    useMutation(REFRESH_TOKEN_MUTATION, {
      onCompleted, // callback
    });

  return refreshTokenMutation({
    variables: {
      refreshTokenInput: {
        refresh_token: jwtRefreshTokenVar(),
      },
    },
  });
};
