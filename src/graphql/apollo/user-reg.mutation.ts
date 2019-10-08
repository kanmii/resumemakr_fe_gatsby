import gql from "graphql-tag";
import { MutationFunction } from "react-apollo";

import userFragment from "./user.fragment";
import {
  UserRegMutation,
  UserRegMutationVariables,
} from "../apollo-types/UserRegMutation";

export const USER_REGISTRATION_MUTATION = gql`
  mutation UserRegMutation($input: RegistrationInput!) {
    registration(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${userFragment}
`;

export type RegUserFn = MutationFunction<
  UserRegMutation,
  UserRegMutationVariables
>;

export interface RegMutationProps {
  regUser?: RegUserFn;
}
