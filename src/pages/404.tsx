import React from "react";
import { Helmet } from "react-helmet-async";
import { RouteComponentProps } from "@reach/router";

import { Page404 } from "../components/Page404";
import { Layout } from "../components/Layout";
import { NOT_FOUND_TITLE } from "../constants";

export default function(props: RouteComponentProps) {
  return (
    <Layout>
      <Helmet>
        <title>{NOT_FOUND_TITLE}</title>
      </Helmet>

      <Page404 />
    </Layout>
  );
}
