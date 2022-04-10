import { gql, useMutation } from "@apollo/client";

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

export const useRefreshToken = (onCompleted) => {
  return useMutation(REFRESH_TOKEN_MUTATION, {
    onCompleted, // callback
  });
};
