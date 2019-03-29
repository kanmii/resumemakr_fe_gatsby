/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AktualisierenAbfrage
// ====================================================

export interface AktualisierenAbfrage_refreshUser {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  name: string;
  email: string;
  jwt: string;
}

export interface AktualisierenAbfrage {
  /**
   * Refresh a user session
   */
  refreshUser: AktualisierenAbfrage_refreshUser | null;
}

export interface AktualisierenAbfrageVariables {
  jwt: string;
}
