import { SITE_TITLE } from "../../src/constants";
import {
  FORM_RENDER_PROPS,
  uiTexts
} from "../../src/components/SignUp/sign-up";
import { RegistrationInput } from "../../src/graphql/apollo/types/globalTypes";
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
    cy.queryByTestId(uiTexts.formErrorTestId).should("not.exist");

    /**
     * When user completes the form with same information as existing user
     */
    Object.entries(FORM_RENDER_PROPS).forEach(([key, [label]]) => {
      if (key === "source") {
        return;
      }

      cy.getByLabelText(new RegExp(label, "i")).type(
        TEST_USER[key as keyof RegistrationInput]
      );
    });

    /**
     * And user submits the form
     */
    cy.getByText(new RegExp(uiTexts.submitBtn, "i")).click();

    cy.getByTestId(uiTexts.formErrorTestId).contains(/email/i);
  });
});
