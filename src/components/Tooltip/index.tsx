import React, { HTMLAttributes, DetailedHTMLProps } from "react";

import "./styles.scss";

export function ToolTip({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
  className = className
    ? `components-tool-tip ${className}`
    : "components-tool-tip";

  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
}
