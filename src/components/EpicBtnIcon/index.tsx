import React, {
  PropsWithChildren,
  DetailedHTMLProps,
  HTMLAttributes
} from "react";

import "./styles.scss";

export function EpicBtnIcon({
  children,
  className,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
>) {
  className = className
    ? `components-epic-btn-icon ${className}`
    : "components-epic-btn-icon";

  return (
    <i className={className} {...props}>
      {children}
    </i>
  );
}
