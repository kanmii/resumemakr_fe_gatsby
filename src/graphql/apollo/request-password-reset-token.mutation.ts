import gql from "graphql-tag";
import { MutationFunction } from "react-apollo";

import {
  RequestPasswordResetToken,
  RequestPasswordResetTokenVariables
} from "../apollo-types/RequestPasswordResetToken";

export const REQUEST_PASSWORD_RESET_TOKEN_MUTATION = gql`
  mutation RequestPasswordResetToken($email: String!) {
    requestPasswordResetToken(email: $email) {
      email
    }
  }
`;


export interface RequestPasswordRequestTokenProps {
  requestPasswordResetToken?: MutationFunction<
  RequestPasswordResetToken,
  RequestPasswordResetTokenVariables
  >;
}
