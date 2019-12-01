import { createUserAndLogin } from "../support/utils";
import { RESUMES_HOME_PATH } from "../../src/routing";
import { createResume } from "../support/create-resume";
import {
  makeResumeRowTitleContainerId,
  makeShowUpdateResumeUITriggerBtnId,
  makeResumeRowTitleId,
} from "../../src/components/MyResumes/my-resumes.dom-selectors";
import {
  domTitleInputId,
  domSubmitBtnId,
  domSubmitSuccessId,
  domCloseModalBtnId,
  domDescriptionInputId,
} from "../../src/components/CreateUpdateCloneResume/create-update-clone-resume.dom-selectors";

beforeEach(() => {
  cy.checkoutSession();
  createUserAndLogin();
});

it("clones from existing resume", () => {
  /**
   * Given there is resume in the system
   */

  createResume().then(resume => {
    const resumeId = resume.id;
    const oldResumeTitle = resume.title;
    const newResumeTitle = oldResumeTitle + "1";
    const domTriggerId = CSS.escape(
      makeShowUpdateResumeUITriggerBtnId(resumeId),
    );
    const domRowTitle = CSS.escape(makeResumeRowTitleId(resumeId));
    const domResumeRowTitleContainer = CSS.escape(
      makeResumeRowTitleContainerId(resumeId),
    );

    /**
     * When user visits resumes page
     */
    cy.visit(RESUMES_HOME_PATH);

    /**
     * Then we should not see update resume trigger button
     */
    cy.get("#" + domTriggerId).should("not.exist");

    /**
     * When user clicks on resume title.
     */
    cy.get("#" + domResumeRowTitleContainer).click();

    /**
     * Then we should not see UI to update resume
     */
    cy.get("#" + domTitleInputId).should("not.exist");

    /**
     * When we click on update resume trigger button
     */
    cy.get("#" + domTriggerId).click();

    /**
     * And complete form fields with new data
     */
    cy.get("#" + domTitleInputId)
      .clear()
      .type(newResumeTitle);

    cy.get("#" + domDescriptionInputId)
      .clear()
      .type("d")
      .blur();

    /**
     * Then we should not see submit success UI
     */
    cy.get("#" + domSubmitSuccessId).should("not.exist");

    /**
     * And resume should still have old title (not yet updated)
     */
    cy.get("#" + domRowTitle).should("have.text", oldResumeTitle);

    /**
     * When we submit the form
     */
    cy.get("#" + domSubmitBtnId).click();

    /**
     * And close the update UI
     */
    cy.get("#" + domCloseModalBtnId).click();

    /**
     * Then we should no longer see UI to update resume
     */
    cy.get("#" + domTitleInputId).should("not.exist");

    /**
     * And resume should now have new title (now updated)
     */
    cy.get("#" + domRowTitle).should("have.text", newResumeTitle);
  });
});
