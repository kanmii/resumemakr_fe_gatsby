import gql from "graphql-tag";
import { graphql, MutationFunction } from "react-apollo";
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

export default USER_LOCAL_MUTATION;

export interface Variable {
  user: UserFragment | null;
}

export type UserLocalMutationFn = MutationFunction<Variable, Variable>;

export interface UserLocalMutationProps {
  updateLocalUser?: UserLocalMutationFn;
}

export const userLocalMutationGql = graphql<
  {},
  Variable,
  Variable,
  UserLocalMutationProps | void
>(USER_LOCAL_MUTATION, {
  props: ({ mutate }) => {
    if (!mutate) {
      return undefined;
    }

    return {
      updateLocalUser: mutate,
    };
  },
});
