import React from "react";
import { Label, LabelProps } from "semantic-ui-react";

import "./styles.scss";

export function CircularLabel({ children, ...props }: LabelProps) {
  return (
    <Label className="components-circular-label" circular={true} {...props}>
      {children}
    </Label>
  );
}
