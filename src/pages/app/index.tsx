import React from "react";
import { Router, RouteComponentProps } from "@reach/router";

import AuthRequired from "../../components/AuthRequired";
import Home from "../../components/Home";
import Resume from "../../components/Resume";
import { RESUMES_HOME_PATH, RESUME_PATH } from "../../routing";

const NotFound = (props: RouteComponentProps & { default: boolean }) => (
  <div>Sorry, nothing here.</div>
);

export function App(props: RouteComponentProps) {
  return (
    <Router style={{ height: "100%" }}>
      <AuthRequired path={RESUME_PATH} component={Resume} />

      <AuthRequired path={RESUMES_HOME_PATH} component={Home} />

      <NotFound default={true} />
    </Router>
  );
}

export default App;
