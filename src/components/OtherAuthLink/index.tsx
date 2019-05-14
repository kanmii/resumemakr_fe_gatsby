import React from "react";
import { Button } from "semantic-ui-react";
import { Link } from "gatsby";

import "./styles.scss";

export function OtherAuthLink({
  isSubmitting,
  url,
  text
}: {
  url: string;
  isSubmitting: boolean;
  text: string;
}) {
  return (
    <Button
      className="components-other-auth-link"
      type="button"
      fluid={true}
      to={url}
      disabled={isSubmitting}
      as={isSubmitting ? "span" : Link}
      basic={true}
    >
      {text}
    </Button>
  );
}
