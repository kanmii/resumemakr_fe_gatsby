import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import {
  PzsTokenkontrollieren,
  PzsTokenkontrollierenVariables
} from "../apollo-types/PzsTokenkontrollieren";

export const PZS_TOKEN_KONTROLLIEREN = gql`
  query PzsTokenkontrollieren($token: String!) {
    pzsTokenKontrollieren(token: $token) {
      token
    }
  }
`;

export default PZS_TOKEN_KONTROLLIEREN;

export type PzsTokenKontrollierenMerkmale = DataValue<
  PzsTokenkontrollieren,
  PzsTokenkontrollierenVariables
>;
