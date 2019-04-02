import React from "react";
import { ApolloProvider } from "react-apollo";
import fetch from "isomorphic-fetch";
import { HelmetProvider } from "react-helmet-async";

import buildClientCache from "./src/State/apollo-setup";
import { ResumemakrProvider } from "./src/components/resumemakr";
import { RootHelmet } from "./src/components/root-helmet";

export const wrapRootElement = ({ element }) => {
  const { client } = buildClientCache({
    isNodeJs: true,
    uri: "/",
    fetch
  });

  return (
    <ApolloProvider client={client}>
      <ResumemakrProvider
        value={{
          client
        }}
      >
        <HelmetProvider>
          <RootHelmet />

          {element}
        </HelmetProvider>
      </ResumemakrProvider>
    </ApolloProvider>
  );
};
