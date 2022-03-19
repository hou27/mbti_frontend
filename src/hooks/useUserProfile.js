import { gql, useQuery } from "@apollo/client";

const USER_PROFILE_QUERY = gql`
  query userProfile($userId: Float!) {
    userProfile(userId: $userId) {
      ok
      error
      user {
        id
        name
        profileImg
        email
        gender
        verified
        birth
        bio
      }
      myResult {
        mbti
        tester {
          id
          name
        }
        nonMemberNickname
      }
      userList {
        mbti
        user {
          id
          name
        }
        nonMemberNickname
      }
    }
  }
`;

export const useUserProfile = (userId) => {
  return useQuery(USER_PROFILE_QUERY, {
    variables: {
      userId,
    },
  });
};
