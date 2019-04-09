import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait } from "react-testing-library";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";
import update from "immutability-helper";

import {
  ResumeForm,
  makeUrlHashSegment
} from "../components/ResumeForm/resume-form-x";
import {
  Props,
  formikConfig,
  nextTooltipText,
  Section,
  prevTooltipText,
  uiTexts,
  getInitialValues
} from "../components/ResumeForm/resume-form";
import { renderWithApollo, fillField } from "./test_utils";
import { makeResumeRoute, ResumePathHash } from "../routing";
import {
  uiTexts as personalInfoUiTexts,
  defaultVal as personalInfoDefaultVal
} from "../components/PersonalInfo/personal-info";
import { UpdateResumeVariables } from "../graphql/apollo/types/UpdateResume";
import {
  GetResume_getResume,
  GetResume_getResume_experiences
} from "../graphql/apollo/types/GetResume";
import { uiTexts as experiencesUiText } from "../components/Experiences/experiences";
import {
  makeListStringFieldName,
  makeListStringHiddenLabelText,
  makeListStringCtrlTestId,
  ListStringsCtrlNames
} from "../components/ListStrings/list-strings-x";
import { makeExperienceFieldName } from "../components/Experiences/experiences-x";

type P = React.ComponentType<Partial<Props>>;
const ResumeFormP = ResumeForm as P;

/**
 * Mock out the Preview component
 */

jest.mock("../components/Preview", () => {
  return () => <div data-testid="preview-resume-section">1</div>;
});

it("renders and navigates correctly", () => {
  const location = {
    hash: "",
    pathname: makeResumeRoute("first resume", "")
  } as WindowLocation;

  const props = {
    values: {}
  } as Partial<Props>;

  /**
   * Given user is on update resume page
   */
  const { Ui: ui } = renderWithApollo(ResumeFormP);
  const Ui = withFormik(formikConfig)(ui) as P;

  const {
    getByTestId,
    queryByTestId,
    getByText,
    queryByText,
    rerender
  } = render(<Ui loading={true} location={location} />);

  /**
   * She sees that personal info section is not loaded on the page
   */
  expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();

  /**
   * And that loading indicator is on the page
   */
  expect(getByTestId("component-resume-update-loading")).toBeInTheDocument();

  /**
   * And that loading error is not visible on the page
   */
  expect(
    queryByTestId("component-resume-update-loading-error")
  ).not.toBeInTheDocument();

  /**
   * When data loading errors
   */
  rerender(<Ui error={{}} location={location} />);

  /**
   * She sees that personal info section is not loaded on the page
   */
  expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();

  /**
   * And that loading indicator is not visible on the page
   */
  expect(
    queryByTestId("component-resume-update-loading")
  ).not.toBeInTheDocument();

  /**
   * And that loading error is visible on the page
   */
  expect(
    getByTestId("component-resume-update-loading-error")
  ).toBeInTheDocument();

  /**
   * When data is done loading correctly
   */
  rerender(<Ui {...props} location={location} />);

  /**
   * She sees that personal info section is loaded on the page
   */
  expect(getByTestId("personal-info-section")).toBeInTheDocument();

  /**
   * And that loading indicator is no longer visible in page
   */
  expect(
    queryByTestId("component-resume-update-loading")
  ).not.toBeInTheDocument();

  /**
   * And that education section is not loaded on the page
   */
  expect(queryByTestId("experiences-section")).not.toBeInTheDocument();

  /**
   * And that 'go to previous section' button is not present on the page
   */
  expect(
    queryByText(new RegExp(prevTooltipText("" as Section), "i"))
  ).not.toBeInTheDocument();

  /**
   * And that next button is present on page
   */
  const nextTooltipExperiencesRegexp = new RegExp(
    nextTooltipText(Section.experiences)
  );
  expect(getByText(nextTooltipExperiencesRegexp)).toBeInTheDocument();

  /**
   * And that preview resume section is not present on the page
   */
  expect(queryByTestId("preview-resume-section")).not.toBeInTheDocument();

  /**
   * When she clicks on 'preview unfinished resume' button
   */
  const partialPreviewResumeTooltipRegexp = new RegExp(
    uiTexts.partialPreviewResumeTooltipText,
    "i"
  );
  const $preview = getByText(partialPreviewResumeTooltipRegexp);
  fireEvent.click($preview);

  rerender(
    <Ui
      {...props}
      location={{
        ...location,
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.preview)
      }}
    />
  );

  /**
   * She sees that personal info section is gone from the page
   */
  expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();

  /**
   * And that preview resume section is loaded unto the page
   */
  expect(getByTestId("preview-resume-section")).toBeInTheDocument();

  /**
   * And that 'preview unfinished resume' button is gone from the page
   */
  expect(
    queryByText(partialPreviewResumeTooltipRegexp)
  ).not.toBeInTheDocument();

  /**
   * And that next button is gone from the page
   */
  expect(queryByText(nextTooltipExperiencesRegexp)).not.toBeInTheDocument();

  /**
   * When she clicks on 'back to editor' button
   */
  fireEvent.click(getByText(uiTexts.backToEditorBtnText));

  rerender(<Ui {...props} location={location} />);

  /**
   * She sees that personal info section is back on the page
   */
  expect(getByTestId("personal-info-section")).toBeInTheDocument();

  /**
   * And that preview resume section is gone from the page
   */
  expect(queryByTestId("preview-resume-section")).not.toBeInTheDocument();

  /**
   * When she clicks on the next button
   */
  let $next = getByText(nextTooltipExperiencesRegexp);
  fireEvent.click($next);

  rerender(
    <Ui
      {...props}
      location={{
        ...location,
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.experiences)
      }}
    />
  );

  /**
   * She sees that the personal info section is gone from page
   */
  expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();

  /**
   * And experience section is loaded
   */
  expect(getByTestId("experiences-section")).toBeInTheDocument();

  /**
   * And the previous button points to personal information section
   */
  const prevTooltipPersonalInfoRegexp = new RegExp(
    prevTooltipText(Section.personalInfo),
    "i"
  );

  expect(getByText(prevTooltipPersonalInfoRegexp)).toBeInTheDocument();

  /**
   * And that additional skills section has not been loaded
   */
  expect(queryByTestId("additional-skills-section")).not.toBeInTheDocument();

  /**
   * And the next button when hovered points to education section
   */
  $next = getByText(new RegExp(nextTooltipText(Section.education), "i"));

  /**
   * When she clicks on next button
   */
  fireEvent.click($next);

  rerender(
    <Ui
      {...props}
      location={{
        ...location,
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.education)
      }}
    />
  );

  /**
   * She sees that the experience section is gone from page
   */
  expect(queryByTestId("experiences-section")).not.toBeInTheDocument();

  /**
   * And education section is loaded
   */
  expect(getByTestId("education-section")).toBeInTheDocument();

  /**
   * And the previous button no longer points to personal information section
   */
  expect(queryByText(prevTooltipPersonalInfoRegexp)).not.toBeInTheDocument();

  /**
   * And that the previous button now points to experiences section
   */
  const prevTooltipExperiencesRegexp = new RegExp(
    prevTooltipText(Section.experiences)
  );

  expect(getByText(prevTooltipExperiencesRegexp)).toBeInTheDocument();

  /**
   * And that next button points to skills section
   */
  const nextTooltipSkillsRegexp = new RegExp(
    nextTooltipText(Section.skills),
    "i"
  );

  $next = getByText(nextTooltipSkillsRegexp);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

  rerender(
    <Ui
      {...props}
      location={{
        ...location,
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.skills)
      }}
    />
  );

  /**
   * She sees that education section is gone from page
   */
  expect(queryByTestId("education-section")).not.toBeInTheDocument();

  /**
   * And that skills section is now loaded unto the page
   */

  expect(getByTestId("skills-section")).toBeInTheDocument();

  /**
   * And that the previous button no longer points experiences sections
   */
  expect(queryByText(prevTooltipExperiencesRegexp)).not.toBeInTheDocument();

  /**
   * And that the previous button now points to education section
   */
  const prevTooltipEduRegexp = new RegExp(
    prevTooltipText(Section.education),
    "i"
  );

  expect(getByText(prevTooltipEduRegexp)).toBeInTheDocument();

  /**
   * And that next button points to additional skills section
   */
  const nextTooltipAddSkillsRegexp = new RegExp(
    nextTooltipText(Section.addSkills),
    "i"
  );

  $next = getByText(nextTooltipAddSkillsRegexp);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

  rerender(
    <Ui
      {...props}
      location={{
        ...location,
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.addSkills)
      }}
    />
  );

  /**
   * She sees that skills section is gone from page
   */
  expect(queryByTestId("skills-section")).not.toBeInTheDocument();

  /**
   * And that additional skills section is now loaded unto the page
   */

  expect(getByTestId("additional-skills-section")).toBeInTheDocument();

  /**
   * And that the previous button no longer points to education sections
   */
  expect(queryByText(prevTooltipEduRegexp)).not.toBeInTheDocument();

  /**
   * And that the previous button now points to skills section
   */
  const prevTooltipSkillsRegexp = new RegExp(prevTooltipText(Section.skills));

  expect(getByText(prevTooltipSkillsRegexp)).toBeInTheDocument();

  /**
   * And that next button points to languages section
   */

  const nextTooltipLangRegexp = new RegExp(nextTooltipText(Section.langs));

  $next = getByText(nextTooltipLangRegexp);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

  rerender(
    <Ui
      {...props}
      location={{
        ...location,
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.langs)
      }}
    />
  );

  /**
   * She sees that additional skills section is gone from page
   */
  expect(queryByTestId("additional-skills-section")).not.toBeInTheDocument();

  /**
   * And that languages section is now loaded unto the page
   */

  expect(getByTestId("languages-section")).toBeInTheDocument();

  /**
   * And that the previous button no longer points to skills sections
   */
  expect(queryByText(prevTooltipSkillsRegexp)).not.toBeInTheDocument();

  /**
   * And that the previous button now points to additional skills section
   */
  const prevTooltipAddSkillsRegexp = new RegExp(
    prevTooltipText(Section.addSkills),
    "i"
  );
  expect(getByText(prevTooltipAddSkillsRegexp)).toBeInTheDocument();

  // ----------------------------------------------------------
  /**
   * And that next button points to hobbies section
   */

  const nextTooltipHobbiesRegexp = new RegExp(
    nextTooltipText(Section.hobbies),
    "i"
  );

  $next = getByText(nextTooltipHobbiesRegexp);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

  rerender(
    <Ui
      {...props}
      location={{
        ...location,
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.hobbies)
      }}
    />
  );

  /**
   * She sees that languages section is gone from page
   */
  expect(queryByTestId("languages-section")).not.toBeInTheDocument();

  /**
   * And that hobbies section is now loaded unto the page
   */

  expect(getByTestId("hobbies-section")).toBeInTheDocument();

  /**
   * And that the previous button no longer points to additional skills sections
   */
  expect(queryByText(prevTooltipAddSkillsRegexp)).not.toBeInTheDocument();

  /**
   * And that the previous button now points to languages section
   */
  const prevTooltipLangsRegexp = new RegExp(
    prevTooltipText(Section.langs),
    "i"
  );

  expect(getByText(prevTooltipLangsRegexp)).toBeInTheDocument();

  /**
   * And that preview unfinished resume button is no longer
   * present on the page
   */
  expect(
    queryByText(partialPreviewResumeTooltipRegexp)
  ).not.toBeInTheDocument();

  /**
   * And that next button points to preview resume section, signalling end
   * of navigation
   */
  const endPreviewResumeTooltipRegexp = new RegExp(
    uiTexts.endPreviewResumeTooltipText,
    "i"
  );

  expect(getByText(endPreviewResumeTooltipRegexp)).toBeInTheDocument();
});

it("updates personal info", async () => {
  const location = {
    hash: "",
    pathname: makeResumeRoute("first resume", "")
  } as WindowLocation;

  const initial = getInitialValues(null);

  const mockUpdateResume = jest.fn();

  const props = {
    getResume: initial,

    updateResume: mockUpdateResume,

    debounceTime: 0
  } as Partial<Props>;

  /**
   * Given user is on update resume page
   */
  const { Ui: ui } = renderWithApollo(ResumeFormP, props);
  const Ui = withFormik(formikConfig)(ui) as P;

  const { /* debug, */ getByLabelText } = render(
    <Ui {...props} location={location} />
  );

  /**
   * She should see that first name input is empty
   */
  const $firstName = getByLabelText(personalInfoUiTexts.firstNameLabel);
  expect($firstName.getAttribute("value")).toBe("");

  /**
   * And that last name input is empty
   */
  const $lastName = getByLabelText(personalInfoUiTexts.lastNameLabel);
  expect($lastName.getAttribute("value")).toBe("");

  /**
   * And that profession input is empty
   */
  const $profession = getByLabelText(personalInfoUiTexts.professionLabel);
  expect($profession.getAttribute("value")).toBe("");

  /**
   * And that address input is empty
   */
  const $address = getByLabelText(personalInfoUiTexts.addressLabel);
  expect($address.textContent).toBe(""); // textarea!!!!!!

  /**
   * And that phone input is empty
   */
  const $phone = getByLabelText(personalInfoUiTexts.phoneLabel);
  expect($phone.getAttribute("value")).toBe("");

  /**
   * And that email input is empty
   */
  const $email = getByLabelText(personalInfoUiTexts.emailLabel);
  expect($email.getAttribute("value")).toBe("");

  /**
   * And that date of birth input is empty
   */
  const $dateOfBirth = getByLabelText(personalInfoUiTexts.dateOfBirthLabel);
  expect($dateOfBirth.getAttribute("value")).toBe("");

  // -------------------------------------------------------------------

  /**
   * When user fills the first name input
   */
  fillField($firstName, personalInfoDefaultVal.firstName as string);

  fireEvent.blur($firstName);

  /**
   * Then the data should be sent to the server
   */
  const initial0 = {
    ...initial,
    personalInfo: { firstName: personalInfoDefaultVal.firstName }
  } as GetResume_getResume;

  await wait(() => {
    expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
      variables: {
        input: initial0
      } as UpdateResumeVariables
    });
  });

  // -------------------------------------------------------------------

  /**
   * When user fills the last name input
   */
  fillField($lastName, personalInfoDefaultVal.lastName as string);

  fireEvent.blur($lastName);

  /**
   * Then the data should be sent to the server
   */
  const initial1 = update(initial0, {
    personalInfo: {
      lastName: {
        $set: personalInfoDefaultVal.lastName as string
      }
    }
  });

  await wait(() => {
    expect(mockUpdateResume.mock.calls[1][0]).toMatchObject({
      variables: {
        input: initial1
      } as UpdateResumeVariables
    });
  });
});

it("updates experiences", async () => {
  const location = {
    hash: makeUrlHashSegment(ResumePathHash.edit, Section.experiences),
    pathname: makeResumeRoute("updates experiences", "")
  } as WindowLocation;

  const initial = getInitialValues(null);
  const [experience] = initial.experiences as GetResume_getResume_experiences[];

  const mockUpdateResume = jest.fn();

  /**
   * Given user is on update resume page
   */
  const { Ui: ui } = renderWithApollo(ResumeFormP, { getResume: initial });
  const Ui = withFormik(formikConfig)(ui) as P;

  const { getByTestId, getByLabelText } = render(
    <Ui
      getResume={initial}
      updateResume={mockUpdateResume}
      debounceTime={0}
      location={location}
    />
  );

  /**
   * User should see that 'position input' has been filled with sample
   */
  const $position = getByLabelText(
    experiencesUiText.positionLabel
  ) as HTMLInputElement;
  expect($position.getAttribute("value")).toEqual(experience.position);

  /**
   * And that 'company input' has been filled with sample texts
   */
  const $company = getByLabelText(experiencesUiText.companyNameLabel);
  expect($company.getAttribute("value")).toEqual(experience.companyName);

  /**
   * And that 'from date input' has been filled with sample texts
   */
  const $fromDate = getByLabelText(experiencesUiText.fromDateLabel);
  expect($fromDate.getAttribute("value")).toEqual(experience.fromDate);

  /**
   * And that 'to date input' has been filled with sample texts
   */
  const $toDate = getByLabelText(experiencesUiText.toDateLabel);
  expect($toDate.getAttribute("value")).toEqual(experience.toDate);

  /**
   * And 'achievement 0 input' has been filled with sample texts
   */

  const achievements = experience.achievements as string[];

  const achievementsSuffixFieldName = makeExperienceFieldName(
    1, // experience index 1-based
    "achievements"
  );

  const achievement0FieldName = makeListStringFieldName(
    achievementsSuffixFieldName,
    0
  );

  const $achievement0 = getByLabelText(
    makeListStringHiddenLabelText(
      achievement0FieldName,
      experiencesUiText.achievementsLabels2
    )
  );

  const $achievement0TextContent = $achievement0.textContent as string;

  expect($achievement0TextContent.length).toBeGreaterThan(0);

  expect($achievement0TextContent).toEqual(achievements[0]);

  /**
   * And 'achievement 1 input' has been filled with sample texts
   */
  const achievement1FieldName = makeListStringFieldName(
    achievementsSuffixFieldName,
    1
  );

  let $achievement1 = getByLabelText(
    makeListStringHiddenLabelText(
      achievement1FieldName,
      experiencesUiText.achievementsLabels2
    )
  );

  const $achievement1TextContent = $achievement1.textContent as string;

  expect($achievement1TextContent.length).toBeGreaterThan(1);

  expect($achievement1TextContent).toEqual(achievements[1]);

  /**
   * When user clicks on achievement 0 add button
   */
  const $achievement0CtrlAddBtn = getByTestId(
    makeListStringCtrlTestId(achievement0FieldName, ListStringsCtrlNames.add)
  );

  fireEvent.click($achievement0CtrlAddBtn);

  /**
   * Then user should see a newly added empty text box under achievement 0
   */
  $achievement1 = getByLabelText(
    makeListStringHiddenLabelText(
      achievement1FieldName,
      experiencesUiText.achievementsLabels2
    )
  );

  expect($achievement1.textContent).toBe("");

  /**
   * And that the previous achievements 1 has been moved down one level
   */
  const achievement2FieldName = makeListStringFieldName(
    achievementsSuffixFieldName,
    2
  );

  const $achievement2 = getByLabelText(
    makeListStringHiddenLabelText(
      achievement2FieldName,
      experiencesUiText.achievementsLabels2
    )
  );

  const $achievement2TextContent = $achievement2.textContent as string;

  expect($achievement2TextContent.length).toBeGreaterThan(1);

  expect($achievement2TextContent).toEqual(achievements[1]); // notice index 1/2

  /**
   * When user fills achievement 1 with text
   */
  fillField($achievement1, "new achievement");

  fireEvent.blur($achievement1);

  /**
   * Then the data should be sent to the server
   */
  const initial0 = update(initial, {
    experiences: {
      0: {
        achievements: {
          $splice: [[1, 0, "new achievement"]]
        }
      }
    }
  });

  await wait(() => {
    expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
      variables: {
        input: initial0
      } as UpdateResumeVariables
    });
  });

  // expect(mockUpdateResume.mock.calls[0])
  // achievements.splice(1, 0, "yes sir");

  // tslint:disable-next-line:no-console
  // console.log(
  //   "\n\t\tLogging start\n\n\n\n achievements\n",
  //   achievements,
  //   "\n\n\n\n\t\tLogging ends\n"
  // );

  /**
   * And that email input is empty
   */
  // const $email = getByLabelText(personalInfoUiTexts.emailLabel);
  // expect($email.getAttribute("value")).toBeNull();

  /**
   * And that date of birth input is empty
   */
  // const $dateOfBirth = getByLabelText(personalInfoUiTexts.dateOfBirthLabel);
  // expect($dateOfBirth.getAttribute("value")).toBeNull();

  // -------------------------------------------------------------------

  /**
   * When user fills the first name input
   */
  // fillField($position, personalInfoDefaultVal.firstName as string);

  // fireEvent.blur($position);

  /**
   * Then the data should be sent to the server
   */
  // const initial0 = {
  //   ...initial,
  //   personalInfo: { firstName: personalInfoDefaultVal.firstName }
  // } as GetResume_getResume;

  // await wait(() => {
  //   expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
  //     variables: {
  //       input: initial0
  //     } as UpdateResumeVariables
  //   });
  // });
});
