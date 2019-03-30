import { createContext, useState, useEffect } from "react";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { PersistCacheFn } from "../State/apollo-setup";

interface ResumemakrContextProps {
  cache?: InMemoryCache;
  client?: ApolloClient<{}>;
  persistCache?: PersistCacheFn;
}

export const ResumemakrContext = createContext<ResumemakrContextProps>({});

export const ResumemakrProvider = ResumemakrContext.Provider;

export function useSetupCachePersistor({
  cache,
  persistCache
}: ResumemakrContextProps) {
  if (!(cache && persistCache)) {
    return null;
  }

  const [loadingCache, setLoadingCache] = useState(false);

  useEffect(function PersistCache() {
    (async function doPersistCache() {
      try {
        await persistCache(cache);
        setLoadingCache(true);
      } catch (error) {
        return error;
      }
    })();
  }, []);

  return loadingCache;
}
