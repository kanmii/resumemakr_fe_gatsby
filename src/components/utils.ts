import { getBackendUrls } from "../State/get-backend-urls";

// tslint:disable-next-line:no-empty
export function noOp() {}

// tslint:disable-next-line:no-any
export function stripTypeName(value: any) {
  if ("object" !== typeof value) {
    return value;
  }

  if ("function" === typeof value.map) {
    return value.map(stripTypeName);
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
