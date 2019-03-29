export const TOKEN_KEY = "resume_makr-token-key";
export const SCHEMA_VERSION = "1.0"; // Must be a string.
export const SCHEMA_VERSION_KEY = "resume_makr-apollo-schema-version";
export const SCHEMA_KEY = "resume_makr-apollo-cache-persist";
export const FIRST_LEVEL_CLASS = "app-container";
export const SECOND_LEVEL_CLASS = "app-main";
export const ALREADY_UPLOADED = "___ALREADY_UPLOADED___";

// istanbul ignore next:
export function makeSiteTitle(title: string) {
  // istanbul ignore next:
  return `${title} | Resume Makr`;
}

// istanbul ignore next:
export function noOp() {
  // istanbul ignore next:
  return null;
}
