import React, {
  PropsWithChildren,
  DetailedHTMLProps,
  HTMLAttributes
} from "react";

import "./epic-btn-icon-styles.scss";

export function EpicBtnIcon({
  children,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
>) {
  return <i {...props}>{children}</i>;
}
