import React from "react";
import { Router } from "@reach/router";

import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import { makeSiteTitle } from "../../constants";
import { appPageUiTexts } from "../../components/app";
import AuthRequired from "../../components/AuthRequired";
import Home from "../../components/Home";
import { Props as HomeProps } from "../../components/Home/home";
import Resume from "../../components/Resume";
import Header from "../../components/Header";
import { CLIENT_ONLY_PATH_PREFIX, RESUME_PATH } from "../../routing";
import { HomeContainer } from "../../components/Home/home-styles";
import { DownloadBtn } from "../../components/Resume/resume-styles";
import { ToolTip } from "../../styles/mixins";

const NotFound = (props: { default: boolean }) => (
  <div>Sorry, nothing here.</div>
);

function ResumesRoute(props: HomeProps) {
  return (
    <HomeContainer>
      <Header />

      <Home {...props} />
    </HomeContainer>
  );
}

export function App() {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle(appPageUiTexts.title)}</title>
      </Helmet>

      <Router style={{ height: "100%" }}>
        <AuthRequired path={CLIENT_ONLY_PATH_PREFIX} component={ResumesRoute} />

        <AuthRequired
          path={RESUME_PATH}
          component={Resume}
          Header={ResumeHeader}
        />

        <NotFound default={true} />
      </Router>
    </Layout>
  );
}

export default App;

function ResumeHeader(props: { downloadFn: () => void }) {
  return (
    <Header
      rightMenuItems={[
        <DownloadBtn key="1" onClick={props.downloadFn}>
          <ToolTip>Download your resume</ToolTip>

          <span>Download</span>
        </DownloadBtn>
      ]}
      {...props}
    />
  );
}
