import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Helmet } from "react-helmet-async";
import { makeSiteTitle } from "../constants";
import { Layout } from "../components/Layout";
import { Login } from "../components/Login/login.index";

export default function LoginPage(props: RouteComponentProps) {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Login")}</title>
      </Helmet>

      <div className="app-container">
        <Login {...props} />
      </div>
    </Layout>
  );
}
