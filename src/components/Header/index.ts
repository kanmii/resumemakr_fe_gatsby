import { graphql, compose } from "react-apollo";

import USER_LOCAL_QUERY, {
  UserLocalGqlProps,
  UserLocalGqlData
} from "../../State/auth.local.query";

import { Header } from "./header-x";
import { OwnProps } from "./header";
import { userLocalMutationGql } from "../../State/user.local.mutation";
import { fetchLogoHOC } from "./fetch-logo";

const userLocalGql = graphql<
  OwnProps,
  UserLocalGqlData,
  {},
  UserLocalGqlProps | undefined
>(USER_LOCAL_QUERY, {
  props: ({ data }) =>
    data && {
      userLocal: data
    }
});

export default compose(
  userLocalGql,
  userLocalMutationGql,
  fetchLogoHOC
)(Header);
