/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ResetPasswordInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ResetPassword
// ====================================================

export interface ResetPassword_resetPassword_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  name: string;
  email: string;
  jwt: string;
}

export interface ResetPassword_resetPassword {
  __typename: "ResetPasswordPayload";
  user: ResetPassword_resetPassword_user | null;
}

export interface ResetPassword {
  resetPassword: ResetPassword_resetPassword | null;
}

export interface ResetPasswordVariables {
  input: ResetPasswordInput;
}
