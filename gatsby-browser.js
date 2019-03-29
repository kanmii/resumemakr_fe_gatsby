import React from "react";
import { ApolloProvider } from "react-apollo";
import "semantic-ui-css-offline";

import "./src/styles/index.css";
import buildClientCache from "./src/State/apollo-setup";

const { client } = buildClientCache();

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);
