import { TEST_USER, createUserAndLogin } from "../support/utils";
import { LOGIN_URL } from "../../src/routing";
import {
  domEmailInputId,
  domPasswordInputId,
  domPasswordConfirmationInputId,
  domSubmitBtnId,
  domSubmitSuccessId,
} from "../../src/components/ResetPassword/reset-password.dom-selectors";
import { domResetPasswordTriggerId } from "../../src/components/PasswordInput/password-input.dom-selectors";
import {
  domEmailInputId as domLoginEmailId,
  domPasswordInputId as domLoginPasswordId,
  domSubmitBtnId as domLoginSubmitId,
  domFormErrorId,
} from "../../src/components/Login/login.dom-selectors";

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
  cy.get("#" + domSubmitSuccessId).should("not.exist");

  const password = TEST_USER.password + "a";

  /**
   * When we complete the form correctly with new password
   */
  cy.get("#" + domEmailInputId)
    .clear()
    .type(TEST_USER.email);

  cy.get("#" + domPasswordInputId).type(password);

  cy.get("#" + domPasswordConfirmationInputId)
    .type(password)
    .blur();

  /**
   * And submit
   */
  cy.get("#" + domSubmitBtnId).click();

  /**
   * Then we should see success UI
   */
  cy.get("#" + domSubmitSuccessId).should("exist");

  /**
   * When we return to login page
   */
  cy.get(".close.icon").click();

  /**
   * And we complete login form with old password
   */
  cy.get("#" + domLoginEmailId)
    .clear()
    .type(TEST_USER.email);

  cy.get("#" + domLoginPasswordId).type(TEST_USER.password);

  /**
   * Then we should not see login error UI
   */
  cy.get("#" + domFormErrorId).should("not.exist");

  /**
   * When we submit
   */
  cy.get("#" + domLoginSubmitId).click();

  /**
   * Then we should see login error UI
   */
  cy.get("#" + domFormErrorId).should("exist");

  /**
   * If we now complete login form with new password
   */
  cy.get("#" + domLoginPasswordId)
    .clear()
    .type(password);

  /**
   * And submit
   */
  cy.get("#" + domLoginSubmitId).click();

  /**
   * The user should be redirected to 'My Resumes' page
   */
  cy.title().should("contain", "My Resumes");
});
