import React from "react";
import { ApolloProvider } from "react-apollo";
import "semantic-ui-css-offline";

import "./src/styles/index.css";
import buildClientCache, { persistCache } from "./src/State/apollo-setup";
import { ResumemakrProvider } from "./src/components/resumemakr";

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
        {element}
      </ResumemakrProvider>
    </ApolloProvider>
  );
};
