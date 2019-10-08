import { SITE_TITLE } from "../../src/constants";
import {
  domNameInputId,
  domSubmitBtnId,
  domEmailInputId,
  domPasswordInputId,
  domPasswordConfirmInputId,
} from "../../src/components/SignUp/signup.dom-selectors";
import { TEST_USER } from "../support/utils";

describe("index page", function() {
  beforeEach(() => {
    cy.checkoutSession();
  });

  it("registers user", function() {
    /**
     * Given a user is on the home page
     */
    cy.visit("/");

    /**
     * Then user should see the title
     */
    cy.title().should("eq", SITE_TITLE);

    /**
     * When user completes the form
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
     * The user should be redirected to 'My Resumes' page
     */
    cy.title().should("contain", "My Resumes");
  });
});
