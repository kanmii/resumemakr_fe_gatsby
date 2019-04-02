import React from "react";
import { Label } from "semantic-ui-react";

import { Container } from "./section-label.style";

interface Props extends React.Props<{}> {
  ico: JSX.Element;
  label: string;
}

export function SectionLabel({ children, label, ico, ...props }: Props) {
  return (
    <Container {...props} raised={true}>
      <Label as="div" ribbon={true} className="segment-label">
        <div className="icon-container">{ico}</div>

        <div className="label-text">{label}</div>
      </Label>

      {children}
    </Container>
  );
}

export default SectionLabel;
