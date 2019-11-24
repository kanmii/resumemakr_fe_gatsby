import { TEST_USER, createUserAndLogin } from "../support/utils";
import { LOGIN_URL } from "../../src/routing";
import {
  domEmailInputId,
  domPasswordInputId,
  domPasswordConfirmationInputId,
  domSubmitBtnId,
  domSubmitServerErrorsId,
} from "../../src/components/ResetPassword/reset-password.dom-selectors";
import { domResetPasswordTriggerId } from "../../src/components/PasswordInput/password-input.dom-selectors";

beforeEach(() => {
  cy.checkoutSession();
  createUserAndLogin(TEST_USER);
});

it("resets password successfully", () => {
  /**
   * Given we are on login page
   */
  cy.visit(LOGIN_URL);

  /**
   * And we click to show password reset UI
   */
  cy.get("#" + domResetPasswordTriggerId).click();

  /**
   * Then we should not see success UI
   */
  cy.get("#" + domSubmitServerErrorsId).should("not.exist");

  /**
   * When we complete the form correctly
   */
  cy.get("#" + domEmailInputId)
    .clear()
    .type("a" + TEST_USER.email);

  cy.get("#" + domPasswordInputId).type(TEST_USER.password);

  cy.get("#" + domPasswordConfirmationInputId)
    .type(TEST_USER.password)
    .blur();

  /**
   * And submit
   */
  cy.get("#" + domSubmitBtnId).click();

  /**
   * Then we should see success UI
   */
  cy.get("#" + domSubmitServerErrorsId).should("exist");
});
