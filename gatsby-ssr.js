import React from "react";
import { ApolloProvider } from "react-apollo";
import fetch from "isomorphic-fetch";

import buildClientCache from "./src/State/apollo-setup";

const { client } = buildClientCache({
  isNodeJs: true,
  uri: "/",
  fetch
});

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);
