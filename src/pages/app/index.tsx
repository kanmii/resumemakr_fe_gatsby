import React from "react";
import { Router, RouteComponentProps } from "@reach/router";

import AuthRequired from "../../components/AuthRequired";
import { ResumesPage } from "../../components/ResumesPage";
import Resume from "../../components/Resume";
import { RESUMES_HOME_PATH, RESUME_PATH } from "../../routing";
import { NotFound } from "../../components/NotFound";

export function App(props: RouteComponentProps) {
  return (
    <Router style={{ height: "100%" }}>
      <AuthRequired path={RESUME_PATH} component={Resume} />

      <AuthRequired path={RESUMES_HOME_PATH} component={ResumesPage} />

      <NotFound default={true} />
    </Router>
  );
}

export default App;
