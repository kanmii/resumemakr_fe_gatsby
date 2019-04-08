import React, {
  PropsWithChildren,
  DetailedHTMLProps,
  AnchorHTMLAttributes
} from "react";

import "./styles.scss";

export function NavBtn({
  children,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
>) {
  return (
    <a tabIndex={0} aria-haspopup="true" {...props}>
      {children}
    </a>
  );
}
