import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import {
  render,
  fireEvent,
  wait,
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
  uiTexts
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
  GetResume_getResume_personalInfo
} from "../graphql/apollo/types/GetResume";
import { UpdateResumeMutationFn } from "../graphql/apollo/update-resume.mutation";
import { ALREADY_UPLOADED } from "../constants";
import { uiTexts as photoFieldUiText } from "../components/PhotoField/photo-field";

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
