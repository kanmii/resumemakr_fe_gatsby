import React from "react";
import { Location, RouteComponentProps } from "@reach/router";

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
