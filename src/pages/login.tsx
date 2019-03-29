import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Helmet } from "react-helmet";

import { makeSiteTitle } from "../constants";

import Layout from "../components/Layout";
import Login from "../components/Login";
import Header from "../components/Header";

export default function LoginPage(props: RouteComponentProps) {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Login")}</title>
      </Helmet>

      <Login header={<Header />} {...props} />
    </Layout>
  );
}
