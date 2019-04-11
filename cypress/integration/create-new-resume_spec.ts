import {
  TEST_USER,
  createUserAndLogin,
  CREATE_RESUME_MINIMAL_DATA
} from "../support/utils";
import { RESUMES_HOME_PATH } from "../../src/routing";
import { uiTexts } from "../../src/components/Home/home";
import {
  Section,
  nextTooltipText
} from "../../src/components/UpdateResumeForm/update-resume-form";
import {
  defaultVal as personalInfoVals,
  uiTexts as personalInfoUiTexts
} from "../../src/components/PersonalInfo/personal-info";
import {
  uiTexts as experiencesUiTexts,
  defaultVal as experiencesVals,
  makeExperienceFieldName
} from "../../src/components/Experiences/experiences";

describe("create new resume page", function() {
  beforeEach(() => {
    cy.checkoutSession();
  });

  it("creates a new resume", () => {
    /**
     * Given a user is logged into the system
     */
    createUserAndLogin(TEST_USER);

    /**
     * And user is at the resumes page
     */
    cy.visit(RESUMES_HOME_PATH, { failOnStatusCode: false });

    /**
     * And user clicks on the prompt to create a new resume
     */
    cy.getByText(/you have no resumes/i).click();

    const { title, description } = CREATE_RESUME_MINIMAL_DATA;

    /**
     * And user fills the title field with the resume title
     */
    cy.queryByLabelText(uiTexts.form.title).type(title);

    /**
     * And user fills the description field with the resume description
     */
    cy.queryByLabelText(new RegExp(uiTexts.form.description, "i")).type(
      description as string
    );

    /**
     * Then user should not see any text that shows user is on the page
     * to complete resume details
     */
    cy.queryByLabelText(personalInfoUiTexts.firstNameLabel).should("not.exist");

    /**
     * When user submits the form
     */
    cy.getByText(uiTexts.form.submitBtnText).click();

    /**
     * Then user should see text that shows user is on the page
     * to complete resume details
     */
    const $firstNameInput = cy.getByLabelText(
      personalInfoUiTexts.firstNameLabel
    );

    /**
     * When user completes the first name field
     */
    $firstNameInput.type(personalInfoVals.firstName as string);

    /**
     * And user completes the last name field
     */
    cy.getByLabelText(personalInfoUiTexts.lastNameLabel).type(
      personalInfoVals.lastName as string
    );

    /**
     * And user completes the profession field
     */
    cy.getByLabelText(personalInfoUiTexts.professionLabel).type(
      personalInfoVals.profession as string
    );

    /**
     * And user uploads an image
     */
    cy.fixture("dog.jpeg").then(fileContent => {
      cy.getByLabelText(/upload photo/i).upload(
        { fileContent, fileName: "dog.jpeg", mimeType: "image/jpeg" },

        { force: true, subjectType: "input" }
      );
    });

    /**
     * And user completes address field
     */
    cy.getByLabelText(personalInfoUiTexts.addressLabel).type(
      personalInfoVals.address as string
    );

    /**
     * And user completes phone field
     */
    cy.getByLabelText(personalInfoUiTexts.phoneLabel).type(
      personalInfoVals.phone as string
    );

    /**
     * And user completes email field
     */
    cy.getByLabelText(personalInfoUiTexts.emailLabel).type(
      personalInfoVals.email as string
    );

    /**
     * Then user should not see any text showing user is on experiences page
     */
    const experiencesPositionLabel = makeExperienceFieldName(0, "position");
    cy.queryByLabelText(experiencesPositionLabel).should("not.exist");

    /**
     * When user clicks on the next button to go to experiences section
     */
    cy.getByText(new RegExp(nextTooltipText(Section.experiences))).click({
      force: true
    });

    /**
     * Then user should see texts showing user is on experiences page
     */
    const $experiencePosition = cy.getByLabelText(experiencesPositionLabel);

    /**
     * And the experiences position field should be pre-filled with sample
     * texts
     */
    $experiencePosition.should("have.value", experiencesVals.position);

    /**
     * And the experiences company field should be pre-filled with sample
     * texts
     */
    const experiencesCompanyLabel = makeExperienceFieldName(0, "companyName");
    cy.getByLabelText(experiencesCompanyLabel).should(
      "have.value",
      experiencesVals.companyName
    );
  });
});
