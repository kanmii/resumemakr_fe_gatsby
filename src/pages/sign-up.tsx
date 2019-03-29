import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Helmet } from "react-helmet";

import Layout from "../components/Layout";
import Header from "../components/Header";
import SignUp from "../components/SignUp";
import { makeSiteTitle } from "../constants";

export default function SignUpPage(props: RouteComponentProps) {
  return (
    <Layout>
      <Header />

      <Helmet>
        <title>{makeSiteTitle("Sign up")}</title>
      </Helmet>

      <SignUp {...props} />
    </Layout>
  );
}
