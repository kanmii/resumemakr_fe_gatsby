export const TOKEN_KEY = "resume_makr-token-key";
export const SCHEMA_VERSION = "1.0"; // Must be a string.
export const SCHEMA_VERSION_KEY = "resume_makr-apollo-schema-version";
export const SCHEMA_KEY = "resume_makr-apollo-cache-persist";
export const FIRST_LEVEL_CLASS = "app-container";
export const SECOND_LEVEL_CLASS = "app-main";
export const ALREADY_UPLOADED = "___ALREADY_UPLOADED___";
export const SITE_TITLE = "Resume Makr";
export const USER_KEY = "1554058206372----x-xxx---1554058219607";

// istanbul ignore next:
export function makeSiteTitle(title: string) {
  // istanbul ignore next:
  return `${title} | ${SITE_TITLE}`;
}

// istanbul ignore next:
export function noOp() {
  // istanbul ignore next:
  return null;
}
