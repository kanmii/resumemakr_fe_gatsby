/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestPasswordResetToken
// ====================================================

export interface RequestPasswordResetToken_requestPasswordResetToken {
  __typename: "RequestPasswordResetToken";
  email: string;
}

export interface RequestPasswordResetToken {
  requestPasswordResetToken: RequestPasswordResetToken_requestPasswordResetToken | null;
}

export interface RequestPasswordResetTokenVariables {
  email: string;
}
