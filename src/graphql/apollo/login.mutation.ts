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

export interface LoginMutationProps {
  login?: MutationFn<LoginMutation, LoginMutationVariables>;
}
