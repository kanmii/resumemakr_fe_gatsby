import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import {
  render,
  fireEvent,
  wait,
  Matcher,
  MatcherOptions,
  SelectorMatcherOptions,
  getByText as domGetByText,
  act
} from "react-testing-library";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";
import update from "immutability-helper";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

import {
  ResumeForm,
  makeUrlHashSegment,
  isBase64String
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
import {
  renderWithApollo,
  fillField,
  uploadFile,
  createFile,
  jpegMime,
  jpegBase64StringPrefix
} from "./test_utils";
import { makeResumeRoute, ResumePathHash } from "../routing";
import {
  uiTexts as personalInfoUiTexts,
  defaultVal as personalInfoDefaultVal
} from "../components/PersonalInfo/personal-info";
import { UpdateResumeVariables } from "../graphql/apollo/types/UpdateResume";
import {
  GetResume_getResume,
  GetResume_getResume_experiences,
  GetResume_getResume_personalInfo
} from "../graphql/apollo/types/GetResume";
import {
  uiTexts as experiencesUiText,
  defaultVal as experiencesDefaultVal,
  emptyVal as experiencesEmptyVal
} from "../components/Experiences/experiences";
import {
  makeListStringFieldName,
  makeListStringHiddenLabelText
} from "../components/ListStrings/list-strings-x";
import { makeExperienceFieldName } from "../components/Experiences/experiences-x";
import { UpdateResumeMutationFn } from "../graphql/apollo/update-resume.mutation";
import { ALREADY_UPLOADED } from "../constants";
import { uiTexts as photoFieldUiText } from "../components/PhotoField/photo-field";
import {
  ListDisplayCtrlNames,
  makeListDisplayCtrlTestId
} from "../components/components";

type P = React.ComponentType<Partial<Props>>;
const ResumeFormP = ResumeForm as P;
const debounceTime = 0;

/**
 * Mock out the Preview component
 */

jest.mock("../components/Preview", () => {
  return () => <div data-testid="preview-resume-section">1</div>;
});

// ---------------------------------TESTS --------------------------------

describe("happy path", () => {
  it("renders and navigates correctly", () => {
    const location = {
      hash: "",
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},

      debounceTime,

      location
    } as Partial<Props>;

    /**
     * Given user is on update resume page
     */
    const { Ui: ui } = renderWithApollo(ResumeFormP, props);
    const Ui = withFormik(formikConfig)(ui) as P;

    const {
      getByTestId,
      queryByTestId,
      getByText,
      queryByText,
      rerender
    } = render(<Ui loading={true} />);

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
    rerender(<Ui error={new ApolloError({ graphQLErrors: [] })} />);

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
    rerender(<Ui {...props} />);

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
});

describe("Personal info", () => {
  it("updates input blur", async () => {
    const location = {
      hash: "",
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const initial = getInitialValues(null);

    const mockUpdateResume = jest.fn();

    const props = {
      getResume: initial,

      updateResume: mockUpdateResume,

      debounceTime,

      location
    } as Partial<Props>;

    /**
     * Given user is on update resume page
     */
    const { Ui: ui } = renderWithApollo(ResumeFormP, props);
    const Ui = withFormik(formikConfig)(ui) as P;

    const { /* debug, */ getByLabelText } = render(<Ui {...props} />);

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
});

describe("Experiences", () => {
  const initial = getInitialValues(null);
  let experience: GetResume_getResume_experiences;
  let achievements: string[];
  let mockUpdateResume: jest.Mock;

  let getByTestId: (
    text: Matcher,
    options?: MatcherOptions | undefined
  ) => HTMLElement;

  let getByLabelText: (
    text: Matcher,
    options?: SelectorMatcherOptions | undefined
  ) => HTMLElement;

  const achievementsPrefixFieldName = makeExperienceFieldName(
    0,
    "achievements"
  );

  const achievement0FieldName = makeListStringFieldName(
    achievementsPrefixFieldName,
    0
  );

  const achievement1FieldName = makeListStringFieldName(
    achievementsPrefixFieldName,
    1
  );

  const achievement2FieldName = makeListStringFieldName(
    achievementsPrefixFieldName,
    2
  );

  const achievement0Label = makeListStringHiddenLabelText(
    achievement0FieldName,
    experiencesUiText.achievementsLabels2
  );

  const achievement1Label = makeListStringHiddenLabelText(
    achievement1FieldName,
    experiencesUiText.achievementsLabels2
  );

  const experiencesHash = makeUrlHashSegment(
    ResumePathHash.edit,
    Section.experiences
  );

  const achievement2Label = makeListStringHiddenLabelText(
    achievement2FieldName,
    experiencesUiText.achievementsLabels2
  );

  beforeEach(() => {
    const location = {
      hash: experiencesHash,
      pathname: makeResumeRoute("updates experiences", "")
    } as WindowLocation;

    [experience] = initial.experiences as GetResume_getResume_experiences[];

    achievements = experience.achievements as string[];

    mockUpdateResume = jest.fn();

    const props = {
      getResume: initial,
      debounceTime,
      location,
      updateResume: mockUpdateResume
    };

    /**
     * Given user is on update resume page
     */
    const { Ui: ui } = renderWithApollo(ResumeFormP, props);

    const Ui = withFormik(formikConfig)(ui) as P;

    const renderArgs = render(<Ui {...props} />);

    getByTestId = renderArgs.getByTestId;

    getByLabelText = renderArgs.getByLabelText;
  });

  it("pre-fills fields", async () => {
    /**
     * User should see that 'position input' has been filled with sample
     */
    const $position = getByLabelText(makeExperienceFieldName(0, "position"));

    expect($position.getAttribute("value")).toEqual(experience.position);

    /**
     * And that 'company input' has been filled with sample texts
     */
    const $company = getByLabelText(makeExperienceFieldName(0, "companyName"));
    expect($company.getAttribute("value")).toEqual(experience.companyName);

    /**
     * And that 'from date input' has been filled with sample texts
     */
    const $fromDate = getByLabelText(makeExperienceFieldName(0, "fromDate"));
    expect($fromDate.getAttribute("value")).toEqual(experience.fromDate);

    /**
     * And that 'to date input' has been filled with sample texts
     */
    const $toDate = getByLabelText(makeExperienceFieldName(0, "toDate"));
    expect($toDate.getAttribute("value")).toEqual(experience.toDate);

    /**
     * And 'achievement 0 input' has been filled with sample texts
     */

    const $achievement0 = getByLabelText(achievement0Label);

    const $achievement0TextContent = $achievement0.textContent as string;

    expect($achievement0TextContent.length).toBeGreaterThan(0);

    expect($achievement0TextContent).toEqual(achievements[0]);

    /**
     * And 'achievement 1 input' has been filled with sample texts
     */

    const $achievement1 = getByLabelText(achievement1Label);

    const $achievement1TextContent = $achievement1.textContent as string;

    expect($achievement1TextContent.length).toBeGreaterThan(1);

    expect($achievement1TextContent).toEqual(achievements[1]);
  });

  it("adds achievement", async () => {
    /**
     * When user clicks on achievement 0 add button
     */
    const $achievement0CtrlAddBtn = getByTestId(
      makeListDisplayCtrlTestId(achievement0FieldName, ListDisplayCtrlNames.add)
    );

    fireEvent.click($achievement0CtrlAddBtn);

    /**
     * Then user should see a newly added empty text box under achievement 0
     */
    const $achievement1 = getByLabelText(achievement1Label);

    expect($achievement1.textContent).toBe("");

    /**
     * And that the previous achievements 1 has been moved down one level
     */

    const $achievement2 = getByLabelText(achievement2Label);

    const $achievement2TextContent = $achievement2.textContent as string;

    expect($achievement2TextContent.length).toBeGreaterThan(1);

    // notice indices 2/1
    expect($achievement2TextContent).toEqual(achievements[1]);

    /**
     * Then the data should be sent to the server
     */
    const input = update(initial, {
      experiences: {
        0: {
          achievements: {
            $splice: [[1, 0, ""]]
          }
        }
      }
    });

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: {
          input
        } as UpdateResumeVariables
      });
    });

    /**
     * When user fills achievement 1 with text
     */

    fillField($achievement1, "new achievement");

    fireEvent.blur($achievement1);

    /**
     * Then the data should be sent to the server
     */
    const inputCall1 = update(initial, {
      experiences: {
        0: {
          achievements: {
            $splice: [[1, 0, "new achievement"]]
          }
        }
      }
    });

    await wait(() => {
      expect(mockUpdateResume.mock.calls[1][0]).toMatchObject({
        variables: {
          input: inputCall1
        } as UpdateResumeVariables
      });
    });
  });

  it("removes achievement", async () => {
    /**
     * When user clicks on achievement 1 remove button
     */
    const $achievement1CtrlRemoveBtn = getByTestId(
      makeListDisplayCtrlTestId(
        achievement1FieldName,
        ListDisplayCtrlNames.remove
      )
    );

    fireEvent.click($achievement1CtrlRemoveBtn);

    /**
     * Then the data should be sent to the server
     */

    const input = update(initial, {
      experiences: {
        0: {
          achievements: {
            $set: [achievements[0], achievements[2]]
          }
        }
      }
    });

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: {
          input
        } as UpdateResumeVariables
      });
    });

    /**
     * And the previous achievement 2 should move up i.e become 1
     */
    const $achievement1 = getByLabelText(achievement1Label);

    expect($achievement1.textContent).toEqual(achievements[2]);

    /**
     * And achievement 0 should not move
     */
    const $achievement0 = getByLabelText(achievement0Label);

    expect($achievement0.textContent).toEqual(achievements[0]);
  });

  it("swaps achievements up", async () => {
    /**
     * When user clicks on 'move up' button of achievement 1
     */
    const $achievement1CtrlUpBtn = getByTestId(
      makeListDisplayCtrlTestId(
        achievement1FieldName,
        ListDisplayCtrlNames.moveUp
      )
    );

    fireEvent.click($achievement1CtrlUpBtn);

    /**
     * Then achievement 1 should move up i.e. become achievement 0
     */
    const $achievement0 = getByLabelText(achievement0Label);

    expect($achievement0.textContent).toEqual(achievements[1]);

    /**
     * And achievement 0 should move down i.e. become achievement 1
     */
    const $achievement1 = getByLabelText(achievement1Label);

    expect($achievement1.textContent).toEqual(achievements[0]);

    /**
     * And achievement 2 should not move
     */
    const $achievement2 = getByLabelText(achievement2Label);

    expect($achievement2.textContent).toEqual(achievements[2]);

    /**
     * And data should be sent to the server
     */
    const inputAchievements = [
      achievements[1],
      achievements[0],
      achievements[2]
    ];

    const input = update(initial, {
      experiences: {
        0: {
          achievements: {
            $set: inputAchievements
          }
        }
      }
    });

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: {
          input
        } as UpdateResumeVariables
      });
    });
  });

  it("swaps achievements down", async () => {
    /**
     * When user clicks on 'move down' button of achievement 1
     */
    const $achievement1CtrlDownBtn = getByTestId(
      makeListDisplayCtrlTestId(
        achievement1FieldName,
        ListDisplayCtrlNames.moveDown
      )
    );

    fireEvent.click($achievement1CtrlDownBtn);

    /**
     * Then achievement 1 should move down i.e. become achievement 2
     */
    const $achievement2 = getByLabelText(achievement2Label);

    expect($achievement2.textContent).toEqual(achievements[1]);

    /**
     * And achievement 2 should move up i.e. become achievement 1
     */
    const $achievement1 = getByLabelText(achievement1Label);

    expect($achievement1.textContent).toEqual(achievements[2]);

    /**
     * And achievement 0 should not move
     */
    const $achievement0 = getByLabelText(achievement0Label);

    expect($achievement0.textContent).toEqual(achievements[0]);

    /**
     * And data should be sent to the server
     */
    const inputAchievements = [
      achievements[0],
      achievements[2],
      achievements[1]
    ];

    const input = update(initial, {
      experiences: {
        0: {
          achievements: {
            $set: inputAchievements
          }
        }
      }
    });

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: {
          input
        } as UpdateResumeVariables
      });
    });
  });
});

describe("update logic", () => {
  it("flags photo to server if photo not changed on client", async () => {
    const formValues = {
      personalInfo: { ...personalInfoDefaultVal, photo: "lovely photo" }
    } as GetResume_getResume;

    expect(
      (formValues.personalInfo as GetResume_getResume_personalInfo).photo
    ).not.toEqual(ALREADY_UPLOADED);

    expect(
      (formValues.personalInfo as GetResume_getResume_personalInfo).address
    ).not.toEqual("awesome address");

    const mockUpdateResume = jest.fn();

    const props = {
      location: {
        hash: "",
        pathname: makeResumeRoute("something", "")
      } as WindowLocation,

      debounceTime,

      updateResume: mockUpdateResume as UpdateResumeMutationFn,

      getResume: formValues
    } as Props;

    const { Ui: ui } = renderWithApollo(ResumeFormP, props);

    const Ui = withFormik(formikConfig)(ui) as P;

    /**
     * Given a user is at the update resume page
     */
    const { getByLabelText } = render(<Ui {...props} />);

    /**
     * And user edits the address field
     */
    const $address = getByLabelText(personalInfoUiTexts.addressLabel);
    fillField($address, "awesome address");

    /**
     * And user blurs the address field
     */
    act(() => {
      fireEvent.blur($address);
    });

    /**
     * Then updated data should be uploaded to server with photo field flagged
     */
    const input = update(formValues, {
      personalInfo: {
        photo: {
          $set: ALREADY_UPLOADED
        },

        address: {
          $set: "awesome address"
        }
      }
    });

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input } as UpdateResumeVariables
      });
    });
  });

  it("uploads new photo as base64 encoded string", async () => {
    const formValues = {} as GetResume_getResume;

    const mockUpdateResume = jest.fn();

    const props = {
      location: {
        hash: "",
        pathname: makeResumeRoute("something", "")
      } as WindowLocation,

      debounceTime,

      updateResume: mockUpdateResume as UpdateResumeMutationFn,

      getResume: formValues
    } as Props;

    const { Ui: ui } = renderWithApollo(ResumeFormP, props);

    const Ui = withFormik(formikConfig)(ui) as P;

    /**
     * Given a user is at the update resume page
     */
    const { getByLabelText } = render(<Ui {...props} />);

    /**
     * And user selects a photo
     */
    const $photo = getByLabelText(photoFieldUiText.uploadPhotoText);

    uploadFile(
      $photo,

      createFile("dog.jpg", 1234, jpegMime)
    );

    /**
     * Then updated data should be uploaded to server with encoded photo
     */

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: {
          input: {
            personalInfo: {
              photo: jpegBase64StringPrefix
            }
          }
        } as UpdateResumeVariables
      });
    });
  });

  it("deletes photo", async () => {
    const formValues = {
      personalInfo: {
        photo: "server generated photo path"
      }
    } as GetResume_getResume;

    const mockUpdateResume = jest.fn();

    const props = {
      location: {
        hash: "",
        pathname: makeResumeRoute("something", "")
      } as WindowLocation,

      debounceTime,

      updateResume: mockUpdateResume as UpdateResumeMutationFn,

      getResume: formValues
    } as Props;

    const { Ui: ui } = renderWithApollo(ResumeFormP, props);

    const Ui = withFormik(formikConfig)(ui) as P;

    /**
     * Given a user is at the update resume page
     */
    const { getByTestId, getByText } = render(<Ui {...props} />);

    /**
     * And user deletes photo
     */
    fireEvent.mouseEnter(getByTestId("photo-preview"));
    fireEvent.click(getByText(photoFieldUiText.deletePhotoText));

    const $modalDescription = getByText(
      photoFieldUiText.deletePhotoConfirmationText
    );

    fireEvent.click(
      domGetByText(
        $modalDescription.closest(".modal") as HTMLDivElement,
        photoFieldUiText.positiveToRemovePhotoText
      )
    );

    /**
     * Then updated data should be uploaded to server with photo set to null
     */

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: {
          input: {
            personalInfo: {
              photo: null
            }
          }
        } as UpdateResumeVariables
      });
    });
  });

  it("renders update error", async () => {
    const errorMessage = "You are not allowed to";

    const mockUpdateResume = jest.fn(() =>
      Promise.reject(
        new ApolloError({
          graphQLErrors: [new GraphQLError(errorMessage)]
        })
      )
    ) as jest.Mock;

    const props = {
      location: {
        hash: "",
        pathname: makeResumeRoute("something", "")
      } as WindowLocation,

      debounceTime,

      updateResume: mockUpdateResume as UpdateResumeMutationFn,

      getResume: {}
    } as Props;

    const { Ui: ui } = renderWithApollo(ResumeFormP, props);

    const Ui = withFormik(formikConfig)(ui);

    /**
     * Given a user is at the update resume page
     */
    const { getByLabelText, queryByText, getByText } = render(
      <Ui {...props} />
    );

    /**
     * Then user should not see any error message
     */
    expect(queryByText(errorMessage)).not.toBeInTheDocument();

    /**
     * When user completes the address input
     */
    const $address = getByLabelText(personalInfoUiTexts.addressLabel);
    fillField($address, "user address");

    /**
     * And user blurs the address field
     */
    fireEvent.blur($address);

    /**
     * Then data should be uploaded to server
     */

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: {
          input: { personalInfo: { address: "user address" } }
        } as UpdateResumeVariables
      });
    });

    /**
     * And user should not see any error message
     */
    expect(getByText(errorMessage)).toBeInTheDocument();
  });
});

describe("isBase64String", () => {
  it("returns false if input does not start with correct string", () => {
    expect(isBase64String("you and me")).toBe(false);
  });

  it("returns false if input is not base64 encoded", () => {
    expect(isBase64String("data:image/jpeg;you and me")).toBe(false);
  });

  it("returns true for base64 encoded encoded string", () => {
    expect(isBase64String("data:image/jpeg;base64,you and me")).toBe(true);
  });
});

describe("Experiences - add/remove/swap", () => {
  const fieldName = "experiences";

  const experiences = [
    { ...experiencesDefaultVal, companyName: "company 1" },

    { ...experiencesDefaultVal, companyName: "company 2", index: 2 },

    { ...experiencesDefaultVal, companyName: "company 3", index: 3 }
  ] as GetResume_getResume_experiences[];

  const initial = { experiences } as GetResume_getResume;

  let mockUpdateResume: jest.Mock;

  let getByTestId: (
    text: Matcher,
    options?: MatcherOptions | undefined
  ) => HTMLElement;

  let getByLabelText: (
    text: Matcher,
    options?: SelectorMatcherOptions | undefined
  ) => HTMLElement;

  let queryByLabelText: (
    text: Matcher,
    options?: SelectorMatcherOptions | undefined
  ) => HTMLElement | null;

  const company0LabelText = makeExperienceFieldName(0, "companyName");
  const company1LabelText = makeExperienceFieldName(1, "companyName");
  const company2LabelText = makeExperienceFieldName(2, "companyName");

  const experiencesHash = makeUrlHashSegment(
    ResumePathHash.edit,
    Section.experiences
  );

  // let debug: (baseElement?: HTMLElement | DocumentFragment | undefined) => void;
  // let container: HTMLElement;

  beforeEach(() => {
    const location = {
      hash: experiencesHash,
      pathname: makeResumeRoute("updates experiences", "")
    } as WindowLocation;

    mockUpdateResume = jest.fn();

    const props = {
      getResume: initial,
      debounceTime,
      location,
      updateResume: mockUpdateResume
    };

    /**
     * Given user is on update resume page
     */
    const { Ui: ui } = renderWithApollo(ResumeFormP, props);

    const Ui = withFormik(formikConfig)(ui) as P;

    const renderArgs = render(<Ui {...props} />);

    getByTestId = renderArgs.getByTestId;

    getByLabelText = renderArgs.getByLabelText;

    queryByLabelText = renderArgs.queryByLabelText;

    // debug = renderArgs.debug;

    // container = renderArgs.container;
  });

  it("adds experience in middle", async () => {
    /**
     * Given that a user sees company 2 at position 2
     */

    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * When user clicks on add button of experience 1
     */
    const experience1AddCtrlBtnId = makeListDisplayCtrlTestId(
      fieldName,
      ListDisplayCtrlNames.add,
      1
    );

    fireEvent.click(getByTestId(experience1AddCtrlBtnId));

    /**
     * Then company that was at position 2 should move to position 3
     */
    const company3LabelText = makeExperienceFieldName(3, "companyName");

    expect(
      (getByLabelText(company3LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * And an empty company should be rendered at position 2
     */
    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual("");

    /**
     * And values should be uploaded to server
     */
    const input = {
      experiences: [
        experiences[0],

        experiences[1],

        { ...experiencesEmptyVal, index: 3 },

        { ...experiences[2], index: 4 }
      ]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input }
      });
    });
  });

  it("adds experience to the end", async () => {
    /**
     * Given that user does not see any company position 3
     */
    const company3LabelText = makeExperienceFieldName(3, "companyName");
    expect(queryByLabelText(company3LabelText)).not.toBeInTheDocument();

    /**
     * When user clicks the add button of experience 2
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.add, 2)
      )
    );

    /**
     * Then user should see a company at position 3
     */
    const $company3 = getByLabelText(company3LabelText) as HTMLInputElement;

    /**
     * And the input box of the company should be empty
     */
    expect($company3.value).toBe("");

    // done();

    /**
     * And correct data should be uploaded to the server
     */
    const input = {
      experiences: [...experiences, { ...experiencesEmptyVal, index: 4 }]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input } as UpdateResumeVariables
      });
    });
  });

  it("removes first experience", async () => {
    /**
     * Given that user sees company 0 at position 0
     */

    expect(
      (getByLabelText(company0LabelText) as HTMLInputElement).value
    ).toEqual(experiences[0].companyName);

    /**
     * And user sees company 1 at position 1
     */

    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * When user clicks on remove button of experience 0
     */

    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 0)
      )
    );

    /**
     * Then company that was at position 1 should move to position 0
     */
    expect(
      (getByLabelText(company0LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * Then company that was at position 2 should move to position 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * And values should be uploaded to server
     */
    const input = {
      experiences: [
        { ...experiences[1], index: 1 },

        { ...experiences[2], index: 2 }
      ]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input }
      });
    });
  });

  it("removes last experience", async () => {
    /**
     * Given that user sees company 2 in the document
     */

    expect(getByLabelText(company2LabelText)).toBeInTheDocument();

    /**
     * When user clicks on remove button of experience 2
     */

    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 2)
      )
    );

    /**
     * Then company 2 should no longer be in the document
     */
    expect(queryByLabelText(company2LabelText)).not.toBeInTheDocument();

    /**
     * And values should be uploaded to server
     */
    const input = {
      experiences: [experiences[0], experiences[1]]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input }
      });
    });
  });

  it("removes experience from the middle", async () => {
    /**
     * Given that user sees company 1 at position 1
     */

    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * And user sees company 2 at position 2
     */

    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * When user clicks on remove button of experience 1
     */

    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 1)
      )
    );

    /**
     * Then company that was at position 2 should move to position 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * And values should be uploaded to server
     */
    const input = {
      experiences: [experiences[0], { ...experiences[2], index: 2 }]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input }
      });
    });
  });

  it("moves experience up from middle", async () => {
    /**
     * Given that user sees company 0 at position 0
     */
    expect(
      (getByLabelText(company0LabelText) as HTMLInputElement).value
    ).toEqual(experiences[0].companyName);

    /**
     * And user sees company 1 at position 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * And user sees company 2 at position 2
     */
    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * When user clicks on move up button of experience 1
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveUp, 1)
      )
    );

    /**
     * Then company that was formerly at position 0 should move to position 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[0].companyName);

    /**
     * And company that was formerly at position 1 should move to position 0
     */
    expect(
      (getByLabelText(company0LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * And company at position 2 should not move
     */
    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * And the right values have been sent to the server
     */
    const input = {
      experiences: [
        { ...experiences[1], index: 1 },
        { ...experiences[0], index: 2 },
        experiences[2]
      ]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toEqual({
        variables: { input } as UpdateResumeVariables
      });
    });
  });

  it("moves last experience up", async () => {
    /**
     * Given that user sees company 1 at position 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * And user sees company 2 at position 2
     */
    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * When user clicks on experience 2 move up button
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveUp, 2)
      )
    );

    /**
     * Then company that was formerly at position 1 should move to position 2
     */
    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * And company that was formerly at position 2 should move to position 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * And company at position 0 should not move
     */
    expect(
      (getByLabelText(company0LabelText) as HTMLInputElement).value
    ).toEqual(experiences[0].companyName);

    /**
     * And correct data should be uploaded to the server
     */
    const input = {
      experiences: [
        experiences[0],
        { ...experiences[2], index: 2 },
        { ...experiences[1], index: 3 }
      ]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input } as UpdateResumeVariables
      });
    });
  });

  it("moves experience down from the middle", async () => {
    /**
     * Given that user sees company 1 at postion 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * And user sees company 2 at position 2
     */
    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * When user clicks move down button on experience 1
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveDown, 1)
      )
    );

    /**
     * Then company that was formerly at postion 1 should move to 2
     */
    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * And company that was formerly at position 2 should move to 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * And company at 0 should not move
     */
    expect(
      (getByLabelText(company0LabelText) as HTMLInputElement).value
    ).toEqual(experiences[0].companyName);

    /**
     * And correct data should be uploaded to the server
     */

    const input = {
      experiences: [
        experiences[0],
        { ...experiences[2], index: 2 },
        { ...experiences[1], index: 3 }
      ]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input } as UpdateResumeVariables
      });
    });
  });

  it("moves first experience down", async () => {
    /**
     * Given user sees company 0 at postion 0
     */
    expect(
      (getByLabelText(company0LabelText) as HTMLInputElement).value
    ).toEqual(experiences[0].companyName);

    /**
     * And user sees company 1 at postion 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * When user clicks the move down button on experience at position 0
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveDown, 0)
      )
    );

    /**
     * Then company that was formerly at position 0 should move to 1
     */
    expect(
      (getByLabelText(company1LabelText) as HTMLInputElement).value
    ).toEqual(experiences[0].companyName);

    /**
     * And company that was formerly at position 1 should move to 0
     */
    expect(
      (getByLabelText(company0LabelText) as HTMLInputElement).value
    ).toEqual(experiences[1].companyName);

    /**
     * And company at position two should not move
     */
    expect(
      (getByLabelText(company2LabelText) as HTMLInputElement).value
    ).toEqual(experiences[2].companyName);

    /**
     * And correct data should be uploaded to the server
     */
    const input = {
      experiences: [
        { ...experiences[1], index: 1 },
        { ...experiences[0], index: 2 },
        experiences[2]
      ]
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: { input } as UpdateResumeVariables
      });
    });
  });
});

/**
 * The timer is affecting other tests, but not when this is the last test
 * in the file.
 */
describe("loading takes too long", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("shows loading takes too long", async () => {
    const takingTooLongText = new RegExp(
      uiTexts.takingTooLongPrefix.slice(0, 10),
      "i"
    );

    const props = {
      location: {
        hash: "",
        pathname: ""
      } as WindowLocation,

      getResume: {},

      loading: true
    } as Props;

    const { Ui: ui } = renderWithApollo(ResumeFormP, props);

    const Ui = withFormik(formikConfig)(ui);

    /**
     * Given a user is at the update resume page
     */
    const { getByText, queryByText } = render(<Ui {...props} />);

    /**
     * Then user should see loading indicator
     */
    expect(getByText(uiTexts.loadingText)).toBeInTheDocument();

    /**
     * After a long period
     */
    jest.advanceTimersByTime(50000);
    jest.runAllTimers();

    /**
     * Then user should see message that loading is taking too long
     */
    getByText(takingTooLongText);

    /**
     * And user should no longer see loading indicator
     */
    expect(queryByText(uiTexts.loadingText)).not.toBeInTheDocument();
  });
});
