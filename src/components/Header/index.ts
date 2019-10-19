import { graphql } from "react-apollo";
import compose from "lodash/flowRight";

import USER_LOCAL_QUERY, {
  UserLocalGqlProps,
  UserLocalGqlData,
} from "../../state/auth.local.query";
import { Header as Comp } from "./component";
import { OwnProps } from "./utils";
import { userLocalMutationGql } from "../../state/user.local.mutation";
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
      userLocal: data,
    },
});

export const Header = compose(
  withMatchHOC(RESUME_PATH, "matchResumeRouteProps"),
  userLocalGql,
  userLocalMutationGql,
  fetchLogoHOC,
)(Comp);
