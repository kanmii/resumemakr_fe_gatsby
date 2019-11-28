import React from "react";
import { Router } from "@reach/router";
import { AuthRequired } from "../../components/AuthRequired/auth-required.component";
import { MyResumes } from "../../components/MyResumes";
import { Resume } from "../../components/Resume/resume-component";
import { RESUMES_HOME_PATH, RESUME_PATH } from "../../routing";
import { NotFound } from "../../components/NotFound";
import { Layout } from "../../components/Layout";

export default function App() {
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
