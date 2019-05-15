import React from "react";
import { Router, RouteComponentProps } from "@reach/router";

import { AuthRequired } from "../../components/AuthRequired";
import { MyResumes } from "../../components/MyResumes";
import { Resume } from "../../components/Resume";
import { RESUMES_HOME_PATH, RESUME_PATH } from "../../routing";
import { NotFound } from "../../components/NotFound";
import { Layout } from "../../components/Layout";

export default function App(props: RouteComponentProps) {
  return (
    <Layout>
      <Router style={{ height: "100%" }}>
        <AuthRequired path={RESUME_PATH} component={Resume} />

        <AuthRequired path={RESUMES_HOME_PATH} component={MyResumes} />

        <NotFound default={true} />
      </Router>
    </Layout>
  );
}
