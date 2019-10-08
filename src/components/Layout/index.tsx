import React, { useContext, useState, useEffect } from "react";
import { ResumemakrContext } from "../../utils/context";
import { RestoreCacheOrPurgeStorageFn } from "../../state/apollo-setup";

export function Layout({ children }: React.PropsWithChildren<{}>) {
  const { cache, restoreCacheOrPurgeStorage, persistor } = useContext(
    ResumemakrContext
  );
  const [loadingCache, setLoadingCache] = useState(true);

  useEffect(() => {
    (async function doPersistCache() {
      try {
        await (restoreCacheOrPurgeStorage as RestoreCacheOrPurgeStorageFn)(
          persistor
        );
        setLoadingCache(false);
      } catch (error) {
        setLoadingCache(false);
      }
    })();
  }, [cache]);

  if (!(cache && restoreCacheOrPurgeStorage)) {
    return null;
  }

  if (loadingCache) {
    return null;
  }

  return <>{children}</>;
}
