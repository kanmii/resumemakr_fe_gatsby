/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ConfirmPasswordResetToken
// ====================================================

export interface ConfirmPasswordResetToken_confirmPasswordResetToken {
  __typename: "PasswordTokenValidityMessage";
  token: string;
}

export interface ConfirmPasswordResetToken {
  /**
   * Confirm that password token is valid
   */
  confirmPasswordResetToken: ConfirmPasswordResetToken_confirmPasswordResetToken | null;
}

export interface ConfirmPasswordResetTokenVariables {
  token: string;
}
