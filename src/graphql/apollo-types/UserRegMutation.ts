/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RegistrationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UserRegMutation
// ====================================================

export interface UserRegMutation_registration_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  name: string;
  email: string;
  jwt: string;
}

export interface UserRegMutation_registration {
  __typename: "RegistrationPayload";
  user: UserRegMutation_registration_user | null;
}

export interface UserRegMutation {
  registration: UserRegMutation_registration | null;
}

export interface UserRegMutationVariables {
  input: RegistrationInput;
}
