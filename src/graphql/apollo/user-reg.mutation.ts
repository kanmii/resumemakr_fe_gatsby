import gql from "graphql-tag";
import { MutationFunction } from "react-apollo";

import userFragment from "./user.fragment";
import {
  UserRegMutation,
  UserRegMutationVariables
} from "../apollo-types/UserRegMutation";

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

export type RegUserFn = MutationFunction<UserRegMutation, UserRegMutationVariables>;

export interface RegMutationProps {
  regUser?: RegUserFn;
}
