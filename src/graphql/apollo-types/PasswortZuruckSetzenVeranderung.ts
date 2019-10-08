/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { VeranderungPasswortZuruckSetzenInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: PasswortZuruckSetzenVeranderung
// ====================================================

export interface PasswortZuruckSetzenVeranderung_veranderungPasswortZuruckSetzen_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  name: string;
  email: string;
  jwt: string;
}

export interface PasswortZuruckSetzenVeranderung_veranderungPasswortZuruckSetzen {
  __typename: "VeranderungPasswortZuruckSetzenPayload";
  user: PasswortZuruckSetzenVeranderung_veranderungPasswortZuruckSetzen_user | null;
}

export interface PasswortZuruckSetzenVeranderung {
  veranderungPasswortZuruckSetzen: PasswortZuruckSetzenVeranderung_veranderungPasswortZuruckSetzen | null;
}

export interface PasswortZuruckSetzenVeranderungVariables {
  input: VeranderungPasswortZuruckSetzenInput;
}
