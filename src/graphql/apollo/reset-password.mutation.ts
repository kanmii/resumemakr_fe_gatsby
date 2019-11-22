import gql from "graphql-tag";
import { MutationFunction, MutationFunctionOptions } from "react-apollo";

import userFragment from "./user.fragment";
import {
  ResetPassword,
  ResetPasswordVariables,
} from "../apollo-types/ResetPassword";
import {
  ResetPasswordSimple,
  ResetPasswordSimpleVariables,
} from "../apollo-types/ResetPasswordSimple";

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

export type ResetPasswordMutationFn = MutationFunction<
  ResetPassword,
  ResetPasswordVariables
>;

export type ResetPasswordMutationFnOptions = MutationFunctionOptions<
  ResetPassword,
  ResetPasswordVariables
>;

export interface ResetPasswordGraphqlProps {
  resetPassword: ResetPasswordMutationFn;
}

////////////////////////// RESET PASSWORD SIMPLE ////////////////////////////

export const RESET_PASSWORD_SIMPLE_MUTATION = gql`
  mutation ResetPasswordSimple($input: ResetPasswordSimpleInput!) {
    resetPasswordSimple(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${userFragment}
`;

export type ResetPasswordSimpleMutationFn = MutationFunction<
  ResetPasswordSimple,
  ResetPasswordSimpleVariables
>;

export type ResetPasswordSimpleMutationFnOptions = MutationFunctionOptions<
  ResetPasswordSimple,
  ResetPasswordSimpleVariables
>;

export interface ResetPasswordSimpleGraphqlProps {
  resetPasswordSimple: ResetPasswordSimpleMutationFn;
}
