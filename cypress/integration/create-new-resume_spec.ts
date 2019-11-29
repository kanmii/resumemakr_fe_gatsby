import { TEST_USER, createUserAndLogin } from "../support/utils";
import { RESUMES_HOME_PATH } from "../../src/routing";
import {
  noResumesMsgId,
  titleInputId,
  descriptionInputId,
  createNewResumeSubmitBtnId,
} from "../../src/components/MyResumes/my-resumes.dom-selectors";
import { nextBtnId } from "../../src/components/UpdateResumeForm/update-resume.dom-selectors";
import { defaultVal as personalInfoVals } from "../../src/components/PersonalInfo/personal-info.utils";
import {
  firstNameFieldId,
  lastNameFieldId,
  professionFieldId,
  addressFieldId,
  phoneFieldId,
  emailFieldId,
} from "../../src/components/PersonalInfo/personal-info.dom-selectors";
import { fileChooserId } from "../../src/components/PhotoField/photo-field.dom-selectors";
import { prefix as experiencesDomId } from "../../src/components/Experiences/experiences.dom-selectors";
import { CREATE_RESUME_MINIMAL_DATA } from "../support/create-resume";

describe("create new resume page", function() {
  beforeEach(() => {
    cy.checkoutSession();
    createUserAndLogin(TEST_USER);
  });

  it("creates a new resume", () => {
    /**
     * And user is at the resumes page
     */
    cy.visit(RESUMES_HOME_PATH);

    /**
     * Then user should see the title
     */
    cy.title().should("contain", "My Resumes");

    /**
     * When user clicks on the prompt to create a new resume
     */
    cy.get("#" + noResumesMsgId).click();

    const { title, description } = CREATE_RESUME_MINIMAL_DATA;

    /**
     * And user fills the title field with the resume title
     */
    cy.get("#" + titleInputId).type(title);

    /**
     * And user fills the description field with the resume description
     */
    cy.get("#" + descriptionInputId).type(description as string);

    /**
     * Then user should not see any text that shows user is on the page
     * to complete resume details
     */
    cy.get("#" + firstNameFieldId).should("not.exist");

    /**
     * When user submits the form
     */
    cy.get("#" + createNewResumeSubmitBtnId).click();

    /**
     * Then page title should change to that of newly created resume
     */
    cy.title().should("contain", title);

    /**
     * When user completes the first name field
     */

    cy.get("#" + firstNameFieldId).type(personalInfoVals.firstName as string);

    /**
     * And user completes the last name field
     */
    cy.get("#" + lastNameFieldId).type(personalInfoVals.lastName as string);

    /**
     * And user completes the profession field
     */
    cy.get("#" + professionFieldId).type(personalInfoVals.profession as string);

    /**
     * And user uploads an image
     */
    cy.fixture("dog.jpeg").then(fileContent => {
      cy.get("#" + fileChooserId).upload(
        { fileContent, fileName: "dog.jpeg", mimeType: "image/jpeg" },

        { force: true, subjectType: "input" },
      );
    });

    /**
     * And user completes address field
     */
    cy.get("#" + addressFieldId).type(personalInfoVals.address as string);

    /**
     * And user completes phone field
     */
    cy.get("#" + phoneFieldId).type(personalInfoVals.phone as string);

    /**
     * And user completes email field
     */
    cy.get("#" + emailFieldId).type(personalInfoVals.email as string);

    /**
     * Then user should not be on experiences page
     */
    cy.get("#" + experiencesDomId).should("not.exist");

    /**
     * When user clicks on the next button to go to experiences section
     */
    cy.get("#" + nextBtnId).click({
      force: true,
    });

    /**
     * Then user should not be on experiences page
     */
    cy.get("#" + experiencesDomId).should("exist");
  });
});
