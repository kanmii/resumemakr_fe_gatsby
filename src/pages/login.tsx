import React from "react";
import { Helmet } from "react-helmet-async";
import { makeSiteTitle } from "../constants";
import { Layout } from "../components/Layout";
import { Login } from "../components/Login/login.component";
import { useResetPasswordSimpleMutationFn } from "../graphql/apollo/reset-password.mutation";

export default function LoginPage() {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Login")}</title>
      </Helmet>

      <div className="app-container">
        <Login useResetPasswordSimple={useResetPasswordSimpleMutationFn()} />
      </div>
    </Layout>
  );
}
