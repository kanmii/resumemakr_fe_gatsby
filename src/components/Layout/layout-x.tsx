import React from "react";

import { useSetupCachePersistor } from "../resumemakr";

export function Layout({ children }: React.PropsWithChildren<{}>) {
  useSetupCachePersistor();

  return <>{children}</>;
}

export default Layout;
