import { useHistory } from "react-router-dom";
import { jwtTokenVar, loggedInFlag } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../localToken";

const { gql, useMutation } = require("@apollo/client");

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

// console.log(watch("email"));
// console.log(errors);

export const useLogin = (onCompleted) => {
  return useMutation(LOGIN_MUTATION, {
    onCompleted, // callback
  });
};
