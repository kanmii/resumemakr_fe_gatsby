import {
  domNameInputId,
  domSubmitBtnId,
  domEmailInputId,
  domPasswordInputId,
  domPasswordConfirmInputId,
  domErrorsId,
} from "../../src/components/SignUp/signup.dom-selectors";
import { TEST_USER, createUser } from "../support/utils";
import { SIGN_UP_URL } from "../../src/routing";

describe("sign up page", function() {
  beforeEach(() => {
    cy.checkoutSession();
  });

  it("returns error if user not unique", function() {
    /**
     * Given there is a user in the system
     */
    createUser(TEST_USER);

    /**
     * And a user visits the registration page
     */
    cy.visit(SIGN_UP_URL);

    /**
     * Then user should see the title
     */
    cy.title().should("match", /sign up/i);

    /**
     * And user should not see any indication of error
     */
    cy.get("#" + domErrorsId).should("not.exist");

    /**
     * When user completes the form with same information as existing user
     */
    cy.get("#" + domNameInputId).type(TEST_USER.name);
    cy.get("#" + domEmailInputId).type(TEST_USER.email);
    cy.get("#" + domPasswordInputId).type(TEST_USER.password);
    cy.get("#" + domPasswordConfirmInputId).type(
      TEST_USER.passwordConfirmation,
    );

    /**
     * And user submits the form
     */
    cy.get("#" + domSubmitBtnId).click();

    /**
     * Then user should see an error message
     */
    cy.get("#" + domErrorsId).contains(/email/i)
  });
});
