import { RegistrationInput } from "../../src/graphql/apollo-types/globalTypes";
import {
  UserRegMutation,
  UserRegMutationVariables,
} from "../../src/graphql/apollo-types/UserRegMutation";
import { USER_REGISTRATION_MUTATION } from "../../src/graphql/apollo/user-reg.mutation";
import { USER_TOKEN_ENV_KEY } from "./constants";
import {
  USER_LOCAL_MUTATION,
  Variable as UserLocalMutation,
} from "../../src/state/user.local.mutation";

export const TEST_USER: RegistrationInput = {
  email: "a@b.com",
  password: "123456",
  passwordConfirmation: "123456",
  source: "password",
  name: "John Doe",
};


export function createUser(input: RegistrationInput = TEST_USER) {
  return cy
    .mutate<UserRegMutation, UserRegMutationVariables>({
      mutation: USER_REGISTRATION_MUTATION,
      variables: {
        input,
      },
    })
    .then(({ data }) => {
      const user = data && data.registration && data.registration.user;

      if (!user) {
        throw new Error("Unable to create user");
      }

      Cypress.env(USER_TOKEN_ENV_KEY, user.jwt);

      return user;
    });
}

export function createUserAndLogin(input: RegistrationInput = TEST_USER) {
  createUser(input).then(user => {
    return cy.mutate<UserLocalMutation, UserLocalMutation>({
      mutation: USER_LOCAL_MUTATION,
      variables: {
        user,
      },
    });
  });
}
