import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Helmet } from "react-helmet-async";

import { makeSiteTitle } from "../constants";

import Layout from "../components/Layout";
import Login from "../components/Login";
import Header from "../components/Header";
import { AppContainer } from "../styles/mixins";

export default function LoginPage(props: RouteComponentProps) {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Login")}</title>
      </Helmet>

      <AppContainer>
        <Login header={<Header />} {...props} />
      </AppContainer>
    </Layout>
  );
}
