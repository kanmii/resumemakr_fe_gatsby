import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { UserFragment } from "../graphql/apollo-types/UserFragment";
import { userFragment } from "../graphql/apollo/user.fragment";

export const USER_LOCAL_MUTATION = gql`
  mutation UserLocalMutation($user: LocalUserInput!) {
    user(user: $user) @client {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export interface Variable {
  user: UserFragment | null;
}

export function useUserLocalMutation() {
  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  return useMutation<Variable, Variable>(USER_LOCAL_MUTATION);
}
