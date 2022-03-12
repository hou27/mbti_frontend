import { gql, useQuery } from "@apollo/client";

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

export const UseFindByEmail = (email) => {
  const { data, loading } = useQuery(FIND_BY_EMAIL_QUERY, {
    variables: {
      findByEmailInput: {
        email,
      },
    },
  });
  return { data, loading };
};
