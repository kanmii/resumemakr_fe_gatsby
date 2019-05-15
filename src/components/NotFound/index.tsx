import React, { useEffect } from "react";
import { RouteComponentProps } from "@reach/router";

import { Page404 } from "../Page404";
import { setDocumentTitle, NOT_FOUND_TITLE } from "../../constants";

export function NotFound({
  default: defaultVal,
  ...props
}: RouteComponentProps & { default: boolean }) {
  useEffect(() => {
    setDocumentTitle(NOT_FOUND_TITLE);
  }, []);

  return <Page404 {...props} />;
}
