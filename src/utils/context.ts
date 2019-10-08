import { createContext } from "react";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { RestoreCacheOrPurgeStorageFn } from "../state/apollo-setup";
import { CachePersistor } from "apollo-cache-persist";

interface ResumemakrContextProps {
  cache: InMemoryCache;
  client: ApolloClient<{}>;
  restoreCacheOrPurgeStorage?: RestoreCacheOrPurgeStorageFn;
  persistor: CachePersistor<{}>;
}

export const ResumemakrContext = createContext<ResumemakrContextProps>(
  {} as ResumemakrContextProps
);

export const ResumemakrProvider = ResumemakrContext.Provider;
