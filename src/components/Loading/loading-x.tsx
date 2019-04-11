import React, { PropsWithChildren } from "react";

import "./styles.scss";
import { addClassNames } from "../components";

export const Loading = ({
  className,
  children,
  ...props
}: PropsWithChildren<{ className?: string }>) => (
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

export default Loading;
