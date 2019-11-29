import React from "react";
import { Router } from "@reach/router";
import { AuthRequired } from "../../components/AuthRequired/auth-required.component";
import { RESUMES_HOME_PATH, RESUME_PATH } from "../../routing";
import { NotFound } from "../../components/NotFound";
import { Layout } from "../../components/Layout";
import Loadable  from "react-loadable";
import { LoadableLoading } from "../../components/Loading/loading.component";

const MyResumes = Loadable({
  loader: () => import("../../components/MyResumes"),
  loading: LoadableLoading,
});

const Resume = Loadable({
  loader: () => import("../../components/Resume/resume-component"),
  loading: LoadableLoading,
});

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
