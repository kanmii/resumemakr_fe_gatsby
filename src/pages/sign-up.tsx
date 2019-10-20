import React from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "../components/Layout";
import { Header } from "../components/Header/header.index";
import { SignUp } from "../components/SignUp/signup.component";
import { makeSiteTitle } from "../constants";

export default function SignUpPage() {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle("Sign up")}</title>
      </Helmet>

      <div className="app-container">
        <Header />

        <SignUp />
      </div>
    </Layout>
  );
}
