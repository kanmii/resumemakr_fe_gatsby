import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import userFragment from "./user.fragment";
import {
  PasswortZuruckSetzenVeranderung,
  PasswortZuruckSetzenVeranderungVariables
} from "../apollo-types/PasswortZuruckSetzenVeranderung";

export const PASSWORT_ZURÜCK_SETZEN_VERANDERUNG = gql`
  mutation PasswortZuruckSetzenVeranderung(
    $input: VeranderungPasswortZuruckSetzenInput!
  ) {
    veranderungPasswortZuruckSetzen(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${userFragment}
`;

export default PASSWORT_ZURÜCK_SETZEN_VERANDERUNG;

export interface PasswortZuruckSetzenVeranderungMerkmale {
  passwortZuruckSetzenVeranderung?: MutationFn<
    PasswortZuruckSetzenVeranderung,
    PasswortZuruckSetzenVeranderungVariables
  >;
}
