import { gql, useQuery } from "@apollo/client";

export const ME_QUERY = gql`
  query getMyInfo {
    me {
      id
      name
      profileImg
      email
      gender
      birth
    }
  }
`;

export const useMe = () => {
  return useQuery(ME_QUERY);
};
