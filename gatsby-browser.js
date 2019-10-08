import React from "react";
import { ApolloProvider } from "react-apollo";
import { HelmetProvider } from "react-helmet-async";
import "./src/styles/semantic-theme/semantic.less";
import "./src/styles/globals.scss";
import buildClientCache, {
  restoreCacheOrPurgeStorage
} from "./src/state/apollo-setup";
import { ResumemakrProvider } from "./src/utils/context";
import { RootHelmet } from "./src/components/root-helmet";

export const wrapRootElement = ({ element }) => {
  const { client, cache, persistor } = buildClientCache();

  return (
    <ApolloProvider client={client}>
      <ResumemakrProvider
        value={{
          client,
          cache,
          persistor,
          restoreCacheOrPurgeStorage
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
