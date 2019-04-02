export const ROOT_URL = "/";
export const LOGIN_URL = "/login";
export const SIGN_UP_URL = "/sign-up";
export const RESET_PATH = "/reset/:token";
export const ZURUCK_SETZEN_PFAD_ANFORDERN = "anfordern";
export const PASSWORD_RESET_PATH = "/password-reset";
export const CLIENT_ONLY_PATH_PREFIX = "/app";
export const RESUME_PATH = CLIENT_ONLY_PATH_PREFIX + "/resume/:title";

// istanbul ignore next:
export function removeTrailingSlash(pathname: string) {
  // istanbul ignore next:
  return pathname === ROOT_URL ? pathname : pathname.replace(/\/$/, "");
}

export enum ResumePathHash {
  edit = "#edit",
  preview = "#preview"
}

export function makeResumeRoute(
  title: string,
  hash: ResumePathHash | "" = ResumePathHash.edit
) {
  return RESUME_PATH.replace(":title", encodeURIComponent(title)) + hash;
}

export interface ResumePathMatch {
  title: string;
}
