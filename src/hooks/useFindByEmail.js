import { gql, useLazyQuery } from "@apollo/client";

const FIND_BY_EMAIL_QUERY = gql`
  query findByEmailQuery($findByEmailInput: FindByEmailInput!) {
    findByEmail(input: $findByEmailInput) {
      ok
      error
      user {
        email
      }
    }
  }
`;

export const useFindByEmail = () => {
  return useLazyQuery(FIND_BY_EMAIL_QUERY);
};
