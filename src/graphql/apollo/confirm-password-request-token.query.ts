import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import {
  ConfirmPasswordResetToken,
  ConfirmPasswordResetTokenVariables,
} from "../apollo-types/ConfirmPasswordResetToken";

export const CONFIRM_PASSWORD_RESET_TOKEN_MUTATION = gql`
  query ConfirmPasswordResetToken($token: String!) {
    confirmPasswordResetToken(token: $token) {
      token
    }
  }
`;

export type ConfirmPasswordResestTokenProps = DataValue<
  ConfirmPasswordResetToken,
  ConfirmPasswordResetTokenVariables
>;
