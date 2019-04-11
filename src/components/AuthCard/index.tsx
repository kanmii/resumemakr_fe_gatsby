import React from "react";
import { Card, CardProps } from "semantic-ui-react";

import "./styles.scss";
import { addClassNames } from "../components";

export function AuthCard({ className, children, ...props }: CardProps) {
  return (
    <Card
      className={addClassNames("components-auth-card", className)}
      {...props}
    >
      {children}
    </Card>
  );
}
