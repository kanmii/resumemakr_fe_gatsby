import { createUserAndLogin } from "../support/utils";
import { RESUMES_HOME_PATH } from "../../src/routing";
import { createResume } from "../support/create-resume";

beforeEach(() => {
  cy.checkoutSession();
  createUserAndLogin();
});

it("clones from existing resume", () => {
  /**
   * Given there is resume in the system
   */

  createResume().then(resume => {
    /**
     * When user visits resumes page
     */
    cy.visit(RESUMES_HOME_PATH);

    /**
     * Then user should see the title
     */
    cy.title().should("contain", "My Resumes");
  });
});
