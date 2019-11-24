import { getBackendUrls } from "../state/get-backend-urls";
import * as Yup from "yup";

// istanbul ignore next:
export function noOp() {
  return null;
}

// tslint:disable-next-line:no-any
export function stripTypeName<T>(value: T): T {
  if ("object" !== typeof value) {
    return value;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
  if ("function" === typeof (value as any).map) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
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
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    {} as any,
  );
}

export function toServerUrl(url: string) {
  return new URL(url, getBackendUrls().root);
}

export type SetFieldValue<T> = (field: string, value: (T | null)[]) => void;

export const PASSWORDS_DO_NOT_MATCH_ERROR_MESSAGE = "Passwords do not match";
export const PASSWORD_TOO_SHORT_ERROR_MESSAGE = "must be at least 4 characters";
export const IS_INVALID_ERROR_MESSAGE = "is invalid";

export const PasswordConfirmationValidationSchema = Yup.string()
  .required("is required")
  .test("passwords-match", PASSWORDS_DO_NOT_MATCH_ERROR_MESSAGE, function(val) {
    return this.parent.password === val;
  });

export const emailValidationSchema = Yup.string()
  .email(IS_INVALID_ERROR_MESSAGE)
  .required("is required");

export const passwordValidationSchema = Yup.string()
  .min(4, PASSWORD_TOO_SHORT_ERROR_MESSAGE)
  .max(50, "is too Long!")
  .required("is required");
