import React from "react";
import { Helmet } from "react-helmet-async";
import { makeSiteTitle } from "../constants";
import { Layout } from "../components/Layout";
import { Login } from "../components/Login/login.component";

export default function LoginPage() {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Login")}</title>
      </Helmet>

      <div className="app-container">
        <Login />
      </div>
    </Layout>
  );
}
