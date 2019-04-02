import React from "react";
import { navigate } from "gatsby";

import { LOGIN_URL } from "../../routing";
import { WithUser } from "../components";
import { RouteComponentProps } from "@reach/router";

type Props = WithUser &
  RouteComponentProps<{}> & {
    // tslint:disable-next-line: no-any
    component: React.ComponentType<any>;
    // tslint:disable-next-line: no-any
  } & any;

export function AuthRequired(props: Props) {
  const { component, user, ...rest } = props;

  const AuthComponent = component;

  if (user) {
    return <AuthComponent {...rest} />;
  }

  navigate(LOGIN_URL);

  return null;
}

export default AuthRequired;
