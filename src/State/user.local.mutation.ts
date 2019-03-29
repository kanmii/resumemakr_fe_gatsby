import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { MutationFn } from "react-apollo";

import { UserFragment } from "../graphql/apollo/types/UserFragment";
import { userFragment } from "../graphql/apollo/user.fragment";

export const userLocalMutation = gql`
  mutation UserLocalMutation($user: LocalUserInput!) {
    user(user: $user) @client {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export default userLocalMutation;

export interface Variable {
  user: UserFragment | null;
}

export interface UserLocalMutationProps {
  updateLocalUser?: MutationFn<Variable, Variable>;
}

export const userLocalMutationGql = graphql<
  {},
  Variable,
  Variable,
  UserLocalMutationProps | void
>(userLocalMutation, {
  props: ({ mutate }) => {
    if (!mutate) {
      return undefined;
    }

    return {
      updateLocalUser: mutate
    };
  }
});
