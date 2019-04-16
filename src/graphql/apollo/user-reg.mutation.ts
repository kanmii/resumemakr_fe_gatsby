import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import userFragment from "./user.fragment";
import {
  UserRegMutation,
  UserRegMutationVariables
} from "./types/UserRegMutation";

export const userRegMutation = gql`
  mutation UserRegMutation($input: RegistrationInput!) {
    registration(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${userFragment}
`;

export default userRegMutation;

export type RegUserFn = MutationFn<UserRegMutation, UserRegMutationVariables>;

export interface RegMutationProps {
  regUser?: RegUserFn;
}
