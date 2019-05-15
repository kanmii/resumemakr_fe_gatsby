import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import userFragment from "./user.fragment";
import { LoginMutation, LoginMutationVariables } from "./types/LoginMutation";

export const loginMutation = gql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${userFragment}
`;

export default loginMutation;

export type LoginMutationFn = MutationFn<LoginMutation, LoginMutationVariables>;

export interface LoginMutationProps {
  login?: LoginMutationFn;
}
