import { SITE_TITLE } from "../../src/constants";
import { FORM_RENDER_PROPS, uiTexts } from "../../src/components/SignUp/utils";
import { RegistrationInput } from "../../src/graphql/apollo-types/globalTypes";
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

    /**
     * The user should be redirected to app page
     */
    cy.title().should("contain", "My Resumes");
  });
});
