import { getBackendUrls } from "../state/get-backend-urls";

// istanbul ignore next:
export function noOp() {
  return null;
}

// tslint:disable-next-line:no-any
export function stripTypeName<T>(value: T): T {
  if ("object" !== typeof value) {
    return value;
  }

  // tslint:disable-next-line: no-any
  if ("function" === typeof (value as any).map) {
    // tslint:disable-next-line: no-any
    return (value as any).map(stripTypeName);
  }

  return Object.entries(value).reduce(
    (acc, [k, v]) => {
      if (k === "__typename") {
        return acc;
      }

      acc[k] = v;
      return acc;
    },
    // tslint:disable-next-line:no-any
    {} as any
  );
}

export function toServerUrl(url: string) {
  return new URL(url, getBackendUrls().root);
}

export type SetFieldValue<T> = (field: string, value: Array<T | null>) => void;
