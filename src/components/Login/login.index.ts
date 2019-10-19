import { graphql,  withApollo } from "react-apollo";
import compose from 'lodash/flowRight'
import USER_LOCAL_QUERY, {
  UserLocalGqlProps,
  UserLocalGqlData
} from "../../state/auth.local.query";
import { Login as Comp } from "./login.component";
import { userLocalMutationGql } from "../../state/user.local.mutation";
import {
  LoginMutation,
  LoginMutationVariables
} from "../../graphql/apollo-types/LoginMutation";
import LOGIN_MUTATION, {
  LoginMutationProps
} from "../../graphql/apollo/login.mutation";
import { loggedOutUserGql } from "../../state/logged-out-user.local.query";

const loginGql = graphql<
  {},
  LoginMutation,
  LoginMutationVariables,
  LoginMutationProps
>(LOGIN_MUTATION, {
  props: props => {
    const mutate = props.mutate;

    return {
      login: mutate
    };
  }
});

const userLocalGql = graphql<
  {},
  UserLocalGqlData,
  {},
  UserLocalGqlProps | undefined
>(USER_LOCAL_QUERY, {
  props: ({ data }) =>
    data && {
      userLocal: data
    }
});

export const Login = compose(
  withApollo,
  loggedOutUserGql,
  userLocalGql,
  userLocalMutationGql,
  loginGql
)(Comp);
