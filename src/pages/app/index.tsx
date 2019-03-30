import React from "react";

import Layout from "../../components/Layout";
import Helmet from "react-helmet";
import { makeSiteTitle } from "../../constants";
import { appPageUiTexts } from "../../components/app";

export function App() {
  return (
    <Layout>
      <Helmet>
        <title>{makeSiteTitle(appPageUiTexts.title)}</title>
      </Helmet>

      <div> Client only page </div>
    </Layout>
  );
}

export default App;
