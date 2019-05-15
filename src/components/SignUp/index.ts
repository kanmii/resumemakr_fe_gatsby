import { graphql, compose, withApollo } from "react-apollo";

import {
  UserRegMutation,
  UserRegMutationVariables
} from "../../graphql/apollo/types/UserRegMutation";

import REG_USER_MUTATION, {
  RegUserFn,
  RegMutationProps
} from "../../graphql/apollo/user-reg.mutation";

import { userLocalMutationGql } from "../../State/user.local.mutation";
import { SignUp as Comp } from "./component";

const regUserGql = graphql<
  {},
  UserRegMutation,
  UserRegMutationVariables,
  RegMutationProps
>(REG_USER_MUTATION, {
  props: props => {
    const mutate = props.mutate as RegUserFn;

    return {
      regUser: mutate
    };
  }
});

export const SignUp = compose(
  withApollo,
  userLocalMutationGql,
  regUserGql
)(Comp);
