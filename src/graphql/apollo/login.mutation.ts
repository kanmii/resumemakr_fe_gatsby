import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import userFragment from "./user.fragment";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../apollo-types/LoginMutation";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${userFragment}
`;

export function useLoginMutation() {
  return useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION);
}
