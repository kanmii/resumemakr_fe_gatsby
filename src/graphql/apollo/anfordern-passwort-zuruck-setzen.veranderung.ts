import gql from "graphql-tag";
import { MutationFunction } from "react-apollo";

import {
  AnfordernPasswortZuruckSetzen,
  AnfordernPasswortZuruckSetzenVariables
} from "../apollo-types/AnfordernPasswortZuruckSetzen";

export const ANFORDERN_PASSWORT_ZURUCK_SETZEN = gql`
  mutation AnfordernPasswortZuruckSetzen($email: String!) {
    anfordernPasswortZuruckSetzen(email: $email) {
      email
    }
  }
`;

export default ANFORDERN_PASSWORT_ZURUCK_SETZEN;

export interface AnfordernPasswortZuruckSetzenMerkmale {
  anfordernPasswortZuruckSetzen?: MutationFunction<
    AnfordernPasswortZuruckSetzen,
    AnfordernPasswortZuruckSetzenVariables
  >;
}
