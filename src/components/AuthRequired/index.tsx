import React, { useEffect } from "react";

import { LOGIN_URL } from "../../routing";
import { withUserHOC } from "../with-user-hoc";

export const AuthRequired = withUserHOC(
  // tslint:disable-next-line: no-any
  function AuthRequiredFn(props: any) {
    const { component, user, ...rest } = props;

    useEffect(() => {
      if (!user) {
        rest.navigate(LOGIN_URL);
        return;
      }
    }, []);

    const AuthComponent = component;

    return user ? <AuthComponent {...rest} /> : null;
  }
);
