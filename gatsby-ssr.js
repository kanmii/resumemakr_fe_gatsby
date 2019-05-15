import React from "react";
import { ApolloProvider } from "react-apollo";
import fetch from "isomorphic-fetch";
import { HelmetProvider } from "react-helmet-async";

import buildClientCache from "./src/State/apollo-setup";
import { ResumemakrProvider } from "./src/components/resumemakr";
import { RootHelmet } from "./src/components/root-helmet";

const helmetContext = {};

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
        <HelmetProvider context={helmetContext}>
          <RootHelmet />

          {element}
        </HelmetProvider>
      </ResumemakrProvider>
    </ApolloProvider>
  );
};

export const onRenderBody = args => {
  setupHelmet(args);
};

function setupHelmet({
  setHeadComponents,
  setHtmlAttributes,
  setBodyAttributes
}) {
  const { helmet } = helmetContext;

  // available only in production build.
  if (helmet == null) {
    return;
  }

  setHeadComponents([
    helmet.base.toComponent(),
    helmet.title.toComponent(),
    helmet.meta.toComponent(),
    helmet.link.toComponent(),
    helmet.style.toComponent(),
    helmet.script.toComponent(),
    helmet.noscript.toComponent()
  ]);

  setHtmlAttributes(helmet.htmlAttributes.toComponent());
  setBodyAttributes(helmet.bodyAttributes.toComponent());
}
