import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Helmet } from "react-helmet-async";
import { Layout } from "../components/Layout";
import { Header } from "../components/Header/header.index";
import { makeSiteTitle } from "../constants";

export default function PasswordResetPage(props: RouteComponentProps) {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Password Reset")}</title>
      </Helmet>

      <Header />

      <div> password reset page</div>
    </Layout>
  );
}
