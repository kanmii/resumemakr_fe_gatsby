import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Helmet } from "react-helmet";

import Layout from "../components/Layout";
import Header from "../components/Header";
import { makeSiteTitle } from "../constants";

export default function PasswordResetPage(props: RouteComponentProps) {
  return (
    <Layout>
      <Header />

      <Helmet>
        <title>{makeSiteTitle("Password Reset")}</title>
      </Helmet>

      <div> password reset page</div>
    </Layout>
  );
}
