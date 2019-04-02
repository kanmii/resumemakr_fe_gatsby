import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Helmet } from "react-helmet-async";

import Layout from "../components/Layout";
import Header from "../components/Header";
import SignUp from "../components/SignUp";
import { makeSiteTitle } from "../constants";
import { AppContainer } from "../styles/mixins";

export default function SignUpPage(props: RouteComponentProps) {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Sign up")}</title>
      </Helmet>

      <AppContainer>
        <Header />

        <SignUp {...props} />
      </AppContainer>
    </Layout>
  );
}
