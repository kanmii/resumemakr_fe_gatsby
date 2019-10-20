import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { userFragment } from "../graphql/apollo/user.fragment";
import { UserFragment } from "../graphql/apollo-types/UserFragment";

interface LoggedOutUserData {
  loggedOutUser?: UserFragment;
}

const LOGGED_OUT_USER_MUTATION = gql`
  query LoggedOutUser {
    loggedOutUser @client {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export function useLoggedOutUserMutation() {
  return useQuery<LoggedOutUserData>(LOGGED_OUT_USER_MUTATION);
}
