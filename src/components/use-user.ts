import { useMemo } from "react";
import {getUser} from '../state/tokens';

export function useUser() {
  return useMemo(() => {
    return getUser();
  }, []);
}
