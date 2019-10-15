import { RegistrationInput } from "../../src/graphql/apollo-types/globalTypes";
import {
  UserRegMutation,
  UserRegMutationVariables
} from "../../src/graphql/apollo-types/UserRegMutation";
import { userRegMutation } from "../../src/graphql/apollo/user-reg.mutation";
import { USER_TOKEN_ENV_KEY } from "./constants";
import {
  userLocalMutation,
  Variable as UserLocalMutation
} from "../../src/state/user.local.mutation";
import { CreateResumeInput } from "../../src/graphql/apollo-types/globalTypes";

export const TEST_USER: RegistrationInput = {
  email: "a@b.com",
  password: "123456",
  passwordConfirmation: "123456",
  source: "password",
  name: "John Doe"
};

export const CREATE_RESUME_MINIMAL_DATA: CreateResumeInput = {
  title: "Resume 1",
  description: "Resume 1 description"
};

export function createUser(input: RegistrationInput) {
  return cy
    .mutate<UserRegMutation, UserRegMutationVariables>({
      mutation: userRegMutation,
      variables: {
        input
      }
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

export function createUserAndLogin(input: RegistrationInput) {
  createUser(input).then(user => {
    return cy.mutate<UserLocalMutation, UserLocalMutation>({
      mutation: userLocalMutation,
      variables: {
        user
      }
    });
  });
}
