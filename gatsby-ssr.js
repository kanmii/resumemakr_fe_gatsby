import React from "react";
import { ApolloProvider } from "react-apollo";
import { HelmetProvider } from "react-helmet-async";
import { ResumemakrProvider } from "./src/utils/context";
import { RootHelmet } from "./src/components/root-helmet";

const helmetContext = {};

export const wrapRootElement = ({ element }) => {
  const cache = new InMemoryCache();

  const link = new HttpLink({
    uri: "/",
    fetch: () => null
  });

  const client = new ApolloClient({
    cache,
    link
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
