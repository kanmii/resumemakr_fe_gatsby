/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PzsTokenkontrollieren
// ====================================================

export interface PzsTokenkontrollieren_pzsTokenKontrollieren {
  __typename: "PzsTokenKontrollierenNachricht";
  token: string;
}

export interface PzsTokenkontrollieren {
  /**
   * Kontrollieren dass Passwortzurücksetzen Token is nicht falsch
   */
  pzsTokenKontrollieren: PzsTokenkontrollieren_pzsTokenKontrollieren | null;
}

export interface PzsTokenkontrollierenVariables {
  token: string;
}
