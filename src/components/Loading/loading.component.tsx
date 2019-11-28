import React, { PropsWithChildren } from "react";
import "./loading.styles.scss";
import { addClassNames } from "../components";
import { LoadingComponentProps } from "react-loadable";

export function LoadableLoading(props: LoadingComponentProps) {
  return <Loading loadableProps={props} />;
}

export function Loading({
  className,
  children,
  loadableProps,
  ...props
}: PropsWithChildren<{
  className?: string;
  loadableProps?: LoadingComponentProps;
}>) {
  return (
    <div className="components-loading">
      <div
        className={addClassNames("components-loading__spinner", className)}
        {...props}
      >
        <div className="double-bounce1" />
        <div className="double-bounce2" />
      </div>

      {children}
    </div>
  );
}
