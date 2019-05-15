import React, { useEffect } from "react";
import { navigate } from "gatsby";

import { LOGIN_URL } from "../../routing";
import { WithUser } from "../with-user-hoc";
import { RouteComponentProps } from "@reach/router";

type Props = WithUser &
  RouteComponentProps<{}> & {
    // tslint:disable-next-line: no-any
    component: React.ComponentType<any>;
    // tslint:disable-next-line: no-any
  } & any;

export function AuthRequired(props: Props) {
  const { component, user, ...rest } = props;

  useEffect(() => {
    if (!user) {
      navigate(LOGIN_URL);
    }
  }, []);

  const AuthComponent = component;

  return <AuthComponent {...rest} />;
}

export default AuthRequired;
