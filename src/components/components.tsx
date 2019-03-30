import React from "react";
import { Location, RouteComponentProps } from "@reach/router";

export function locationHOC<TProps extends RouteComponentProps>(
  Component: React.FunctionComponent<TProps>
) {
  return function HOC(props: TProps) {
    return (
      <Location>
        {locationProps => <Component {...locationProps} {...props} />}
      </Location>
    );
  };
}
