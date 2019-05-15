import { RefObject } from "react";

export function scrollToTop(mainRef: RefObject<HTMLDivElement>) {
  if (mainRef && mainRef.current) {
    mainRef.current.scrollTop = 0;
  }
}
