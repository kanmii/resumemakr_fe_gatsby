import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Helmet } from "react-helmet-async";
import { Layout } from "../components/Layout";
import { Header } from "../components/Header";
import { SignUp } from "../components/SignUp/signup.index";
import { makeSiteTitle } from "../constants";

export default function SignUpPage(props: RouteComponentProps) {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Sign up")}</title>
      </Helmet>

      <div className="app-container">
        <Header />

        <SignUp {...props} />
      </div>
    </Layout>
  );
}
