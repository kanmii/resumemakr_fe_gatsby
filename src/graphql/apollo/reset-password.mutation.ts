import gql from "graphql-tag";
import { MutationFunction } from "react-apollo";

import userFragment from "./user.fragment";
import {
  ResetPassword,
  ResetPasswordVariables,
} from "../apollo-types/ResetPassword";

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${userFragment}
`;

export interface ResetPasswordProps {
  resetPassword?: MutationFunction<ResetPassword, ResetPasswordVariables>;
}
