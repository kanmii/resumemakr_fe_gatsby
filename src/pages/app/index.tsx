import React from "react";
import { Router } from "@reach/router";

import AuthRequired from "../../components/AuthRequired";
import Home from "../../components/Home";
import Resume from "../../components/Resume";
import { CLIENT_ONLY_PATH_PREFIX, RESUME_PATH } from "../../routing";

const NotFound = (props: { default: boolean }) => (
  <div>Sorry, nothing here.</div>
);

export function App() {
  return (
    <Router style={{ height: "100%" }}>
      <AuthRequired path={CLIENT_ONLY_PATH_PREFIX} component={Home} />

      <AuthRequired path={RESUME_PATH} component={Resume} />

      <NotFound default={true} />
    </Router>
  );
}

export default App;
