import React from "react";
import { Button } from "semantic-ui-react";
import { Link } from "gatsby";

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
      className="to-login-button"
      type="button"
      fluid={true}
      to={url}
      disabled={isSubmitting}
      as={isSubmitting ? "span" : Link}
    >
      {text}
    </Button>
  );
}
