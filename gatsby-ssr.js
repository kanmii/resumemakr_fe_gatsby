import React from "react";
import { ApolloProvider } from "react-apollo";
import fetch from "isomorphic-fetch";

import buildClientCache from "./src/State/apollo-setup";
import { ResumemakrProvider } from "./src/components/resumemakr";

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
        {element}
      </ResumemakrProvider>
    </ApolloProvider>
  );
};
