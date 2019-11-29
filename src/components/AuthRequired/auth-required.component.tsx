/* eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useLayoutEffect, ComponentType } from "react";
import { useUser } from "../use-user";
import {redirectToLogin} from './auth-required.injectables'

export function AuthRequired<P>(props: Props<P>) {
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

export type Props<P> = P & any & {
  component: ComponentType<any>;
};
