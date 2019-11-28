import gql from "graphql-tag";
import {
  MutationFunction,
  MutationFunctionOptions,
  useMutation,
  MutationResult,
} from "react-apollo";
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

export function useResetPasswordSimpleMutationFn(): UseResetPasswordSimpleMutation {
  return useMutation(RESET_PASSWORD_SIMPLE_MUTATION);
}

export type ResetPasswordSimpleMutationFn = MutationFunction<
  ResetPasswordSimple,
  ResetPasswordSimpleVariables
>;

// used to type check test mock calls
export type ResetPasswordSimpleMutationFnOptions = MutationFunctionOptions<
  ResetPasswordSimple,
  ResetPasswordSimpleVariables
>;

export interface ResetPasswordSimpleGraphqlProps {
  useResetPasswordSimple: UseResetPasswordSimpleMutation;
}

export type UseResetPasswordSimpleMutation = [
  ResetPasswordSimpleMutationFn,
  MutationResult<ResetPasswordSimple>,
];
