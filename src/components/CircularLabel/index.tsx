import React from "react";
import { Label, LabelProps } from "semantic-ui-react";

import "./styles.scss";
import { addClassNames } from "../components";

export function CircularLabel({ className, children, ...props }: LabelProps) {
  return (
    <Label
      className={addClassNames("components-circular-label", className)}
      circular={true}
      {...props}
    >
      {children}
    </Label>
  );
}
