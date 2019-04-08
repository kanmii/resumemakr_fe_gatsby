import React from "react";
import { Helmet } from "react-helmet-async";

import Resume from "./resume-x";
import { Props } from "./resume";
import Layout from "../Layout";
import { makeSiteTitle } from "../../constants";
import { appPageUiTexts } from "../app";
import { ResumeHeader } from "./header";

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
