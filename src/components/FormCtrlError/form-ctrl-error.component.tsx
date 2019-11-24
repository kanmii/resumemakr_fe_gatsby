import React from "react";
import makeClassName from "classnames";

import "./form-ctrl-error.styles.scss";
import { GenericComponentProps } from "../components.types";

interface Props extends GenericComponentProps {
  error?: null | string;
}

export function FormCtrlError(props: Props) {
  const { error, id = "", className = "", children, ...others } = props;

  return children || error ? (
    <div
      className={makeClassName({
        "components-form-control-error": true,
        [className]: !!className,
      })}
      id={id + ""}
      {...others}
    >
      {children || error}
    </div>
  ) : null;
}
