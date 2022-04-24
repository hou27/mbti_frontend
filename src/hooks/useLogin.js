import { gql, useMutation } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      access_token
      refresh_token
    }
  }
`;

export const useLogin = (onCompleted) => {
  return useMutation(LOGIN_MUTATION, {
    onCompleted, // callback
  });
};
