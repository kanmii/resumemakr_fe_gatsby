import gql from "graphql-tag";
import { MutationFunction } from "react-apollo";
import userFragment from "./user.fragment";
import { LoginMutation, LoginMutationVariables } from "../apollo-types/LoginMutation";

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

export type LoginMutationFn = MutationFunction<LoginMutation, LoginMutationVariables>;

export interface LoginMutationProps {
  login?: LoginMutationFn;
}
