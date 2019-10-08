export const TOKEN_KEY = "P0rNhc+WR07msnuO6gABDVAsy71tmZlWf/";
export const SCHEMA_VERSION = "1.0"; // Must be a string.
export const SCHEMA_VERSION_KEY = "MpoOWFuCO4i+QmRoRL5nbOpDn6/q";
export const SCHEMA_KEY = "5gro1XnXYrLdLsOJXFEg33TDl";
export const FIRST_LEVEL_CLASS = "app-container";
export const SECOND_LEVEL_CLASS = "app-main";
export const ALREADY_UPLOADED = "___ALREADY_UPLOADED___";
export const SITE_TITLE = "Resume Makr";
export const USER_KEY = "+hrHxhWHP/MaZciRsVtkJ7AFsi2PMP";
export const NOT_FOUND_TITLE = `Page Not Found | ${SITE_TITLE}`;

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

export function setDocumentTitle(title?: string) {
  document.title = title ? title : SITE_TITLE;
}
