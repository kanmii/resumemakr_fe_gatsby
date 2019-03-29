import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import userFragment from "./user.fragment";
import {
  AktualisierenAbfrage,
  AktualisierenAbfrageVariables
} from "./types/AktualisierenAbfrage";

export const AKTUALISIEREN_ABFRAGE = gql`
  query AktualisierenAbfrage($jwt: String!) {
    refreshUser(jwt: $jwt) {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export default AKTUALISIEREN_ABFRAGE;

export type AktualisierenAbfrageMerkmale = DataValue<
  AktualisierenAbfrage,
  AktualisierenAbfrageVariables
>;
