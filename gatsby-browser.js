import React from "react";
import { ApolloProvider } from "react-apollo";
import "semantic-ui-css-offline";
import { HelmetProvider } from "react-helmet-async";

import "./src/styles/index.css";
import buildClientCache, { persistCache } from "./src/State/apollo-setup";
import { ResumemakrProvider } from "./src/components/resumemakr";
import { RootHelmet } from "./src/components/root-helmet";
import GlobalStyle from "./src/styles/global-style";

export const wrapRootElement = ({ element }) => {
  const { client, cache } = buildClientCache();

  return (
    <ApolloProvider client={client}>
      <ResumemakrProvider
        value={{
          client,
          cache,
          persistCache
        }}
      >
        <HelmetProvider>
          <RootHelmet />

          <GlobalStyle />

          {element}
        </HelmetProvider>
      </ResumemakrProvider>
    </ApolloProvider>
  );
};
