import React from "react";
import { HomePage } from "../components/HomePage/home-page.component";
import { RouteComponentProps } from "@reach/router";
import { Layout } from "../components/Layout";
import { Helmet } from "react-helmet-async";
import { SITE_TITLE } from "../constants";

export default function(props: RouteComponentProps) {
  return (
    <Layout>
      <Helmet>
        <title>{SITE_TITLE}</title>
      </Helmet>
      <HomePage {...props} />
    </Layout>
  );
}
