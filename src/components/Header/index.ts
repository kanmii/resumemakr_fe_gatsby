import { graphql, compose } from "react-apollo";

import USER_LOCAL_QUERY, {
  UserLocalGqlProps,
  UserLocalGqlData
} from "../../State/auth.local.query";
import { Header as Comp } from "./component";
import { OwnProps } from "./utils";
import { userLocalMutationGql } from "../../State/user.local.mutation";
import { fetchLogoHOC } from "./fetch-logo-hoc";
import { withMatchHOC } from "../with-match-hoc";
import { RESUME_PATH } from "../../routing";

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

export const Header = compose(
  withMatchHOC(RESUME_PATH, "matchResumeRouteProps"),
  userLocalGql,
  userLocalMutationGql,
  fetchLogoHOC
)(Comp);
