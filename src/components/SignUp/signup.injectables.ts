import { useMutation } from "react-apollo";
import { USER_REGISTRATION_MUTATION } from "../../graphql/apollo/user-reg.mutation";
import {
  UserRegMutation,
  UserRegMutationVariables,
} from "../../graphql/apollo-types/UserRegMutation";

export function useUserRegistrationMutation() {
  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  return useMutation<UserRegMutation, UserRegMutationVariables>(
    USER_REGISTRATION_MUTATION,
  );
}
