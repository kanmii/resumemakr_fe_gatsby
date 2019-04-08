import { useEffect, RefObject } from "react";

/**
 * We set the class name of the root element programmatically because for some
 * strange reasons, gatsby will not set the class name or any other attributes
 * in production
 */
export function useSetParentClassNameOnMount(
  refObj: RefObject<HTMLDivElement>,
  className: string
) {
  useEffect(() => {
    if (refObj && refObj.current) {
      const { parentElement } = refObj.current;

      if (parentElement) {
        parentElement.classList.add(className);
      }
    }
  }, []);
}
