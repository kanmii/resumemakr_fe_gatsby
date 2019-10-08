import React from "react";
import { Label, Segment } from "semantic-ui-react";

import "./styles.scss";

interface Props extends React.Props<{}> {
  ico: JSX.Element;
  label: string;
  id?: string;
}

export function SectionLabel(props: Props) {
  const { children, label, ico, ...rest } = props;

  return (
    <Segment className="component-section-label" {...rest} raised={true}>
      <Label as="div" ribbon={true} className="segment-label">
        <div className="icon-container">{ico}</div>

        <div className="label-text">{label}</div>
      </Label>

      {children}
    </Segment>
  );
}
