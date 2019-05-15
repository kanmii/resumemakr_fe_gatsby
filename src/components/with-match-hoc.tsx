import React from "react";
import { Match, MatchRenderProps } from "@reach/router";

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
