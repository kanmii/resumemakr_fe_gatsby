import React from "react";
import {
  Location,
  RouteComponentProps,
  Match,
  MatchRenderProps
} from "@reach/router";

import { UserFragment } from "../graphql/apollo/types/UserFragment";
import { getUser } from "../State/tokens";

export function withLocationHOC<TProps extends RouteComponentProps>(
  Component: React.ComponentType<TProps>
) {
  return function HOC(props: TProps) {
    return (
      <Location>
        {locationProps => <Component {...locationProps} {...props} />}
      </Location>
    );
  };
}

/**
 * @param path {string}: the path to match against
 * @param propKey {string}: the prop key of the component that will contain the
 *    match render function parameters
 */
export function withMatchHOC<TProps = {}, TMatch = {}>(
  path: string,
  propKey?: string
) {
  return function withMatch(Component: React.ComponentType<TProps>) {
    return function HOC(props: TProps & MatchRenderProps<TMatch>) {
      return (
        <Match path={path}>
          {matchProps => {
            const injected = propKey ? { [propKey]: matchProps } : matchProps;

            return <Component {...injected} {...props} />;
          }}
        </Match>
      );
    };
  };
}

export interface WithUser {
  user?: UserFragment | null;
}

export function withUserHOC<TProps extends WithUser>(
  Component: React.FunctionComponent<TProps> | React.ComponentClass<TProps>
) {
  return function HOC(props: TProps) {
    return <Component user={getUser()} {...props} />;
  };
}

export enum ListDisplayCtrlNames {
  add = "add",

  remove = "remove",

  moveUp = "move up",

  moveDown = "move down",

  none = "none"
}

export function makeListDisplayCtrlTestId(
  fieldName: string,
  ctrlName: ListDisplayCtrlNames,
  ...others: Array<number | string>
) {
  return fieldName + " " + ctrlName + (others || []).join(" ");
}

export function addClassNames(
  className1: string,
  ...otherClassNames: Array<string | undefined>
) {
  if (otherClassNames) {
    return className1 + " " + otherClassNames.join(" ");
  }

  return className1;
}
