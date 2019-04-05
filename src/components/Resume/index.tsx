import React from "react";
import { Helmet } from "react-helmet-async";
import { LocationContext, WindowLocation, NavigateFn } from "@reach/router";

import Resume from "./resume-x";
import { DownloadBtn } from "./resume-styles";
import { ToolTip } from "../../styles/mixins";
import { Props } from "./resume";
import Header from "../Header";
import Layout from "../Layout";
import { makeSiteTitle } from "../../constants";
import { appPageUiTexts } from "../app";
import { withLocationHOC } from "../components";
import { ResumePathHash } from "../../routing";

// tslint:disable-next-line: no-any
const ResumeHeader: any = withLocationHOC(function ResumeHeader1(
  props: LocationContext
) {
  const location = props.location as WindowLocation;
  const navigate = props.navigate as NavigateFn;

  // istanbul ignore next: trust @reach/router to properly inject location
  const url = (location.pathname || "") + ResumePathHash.preview;

  return (
    <Header
      rightMenuItems={[
        <DownloadBtn key="1" onClick={() => navigate(url)}>
          <ToolTip>Download your resume</ToolTip>

          <span>Download</span>
        </DownloadBtn>
      ]}
      {...props}
    />
  );
});

export default function(props: Props) {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle(appPageUiTexts.title)}</title>
      </Helmet>
      <Resume {...props} header={<ResumeHeader />} />
    </Layout>
  );
}
