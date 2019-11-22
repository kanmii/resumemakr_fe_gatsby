/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ResetPasswordSimpleInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ResetPasswordSimple
// ====================================================

export interface ResetPasswordSimple_resetPasswordSimple_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  name: string;
  email: string;
  jwt: string;
}

export interface ResetPasswordSimple_resetPasswordSimple {
  __typename: "ResetPasswordSimplePayload";
  user: ResetPasswordSimple_resetPasswordSimple_user | null;
}

export interface ResetPasswordSimple {
  resetPasswordSimple: ResetPasswordSimple_resetPasswordSimple | null;
}

export interface ResetPasswordSimpleVariables {
  input: ResetPasswordSimpleInput;
}
