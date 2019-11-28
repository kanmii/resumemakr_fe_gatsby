import React, { useLayoutEffect, ComponentType } from "react";
import { useUser } from "../use-user";
import { RouteComponentProps } from "@reach/router";
import {redirectToLogin} from './auth-required.injectables'

export function AuthRequired(props: Props) {
  const { component, ...rest } = props;
  const user = useUser();

  useLayoutEffect(() => {
    if (!user) {
      redirectToLogin()
      return;
    }
  }, [user]);

  const AuthComponent = component;

  return user ? <AuthComponent {...rest} /> : null;
}

export type Props = RouteComponentProps & {
  component: ComponentType<RouteComponentProps>;
};
