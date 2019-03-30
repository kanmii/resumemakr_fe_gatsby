import { RegistrationInput } from "../../src/graphql/apollo/types/globalTypes";
import {
  UserRegMutation,
  UserRegMutationVariables
} from "../../src/graphql/apollo/types/UserRegMutation";
import userRegMutation from "../../src/graphql/apollo/user-reg.mutation";
import { USER_TOKEN_ENV_KEY } from "./constants";

export const TEST_USER: RegistrationInput = {
  email: "a@b.com",
  password: "123456",
  passwordConfirmation: "123456",
  source: "password",
  name: "John Doe"
};

export function createUser(input: RegistrationInput) {
  cy.mutate<UserRegMutation, UserRegMutationVariables>({
    mutation: userRegMutation,
    variables: {
      input
    }
  }).then(({ data }) => {
    const user = data && data.registration && data.registration.user;

    if (!user) {
      throw new Error("Unable to create user");
    }

    Cypress.env(USER_TOKEN_ENV_KEY, user.jwt);
  });
}
