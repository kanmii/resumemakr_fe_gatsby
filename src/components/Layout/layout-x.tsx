import React from "react";

import GlobalStyle from "../../styles/global-style";
import { useSetupCachePersistor } from "../resumemakr";

export function Layout({ children }: React.PropsWithChildren<{}>) {
  useSetupCachePersistor();

  return (
    <>
      <GlobalStyle />

      {children}
    </>
  );
}

export default Layout;
