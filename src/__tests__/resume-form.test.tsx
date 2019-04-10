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

describe("Resume form sections", () => {
  const prevTooltipPersonalInfoRegexp = new RegExp(
    prevTooltipText(Section.personalInfo),
    "i"
  );

  const prevTooltipExperiencesRegexp = new RegExp(
    prevTooltipText(Section.experiences)
  );

  it("renders loading error", () => {
    /**
     * Given user is on update resume page
     */

    const { getByText } = render(
      <ResumeFormP
        location={{} as WindowLocation}
        error={
          new ApolloError({
            networkError: new Error("network error has occurred")
          })
        }
      />
    );

    /**
     * Then user should see network error
     */
    expect(getByText("network error has occurred")).toBeInTheDocument();
  });

  it("renders loading indicator", () => {
    /**
     * Given user is on update resume page
     */

    const { getByTestId } = render(
      <ResumeFormP location={{} as WindowLocation} loading={true} />
    );

    /**
     * Then user should see error message
     */
    expect(getByTestId("component-resume-update-loading")).toBeInTheDocument();
  });

  it("renders personal info section", () => {
    const location = {
      hash: "",
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},
      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <ResumeFormP {...props} {...p} />
    )) as P;

    /**
     * Given user is on personal info section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(
      <Ui {...props} />
    );

    /**
     * Then user should see that personal info section is loaded on the page
     */
    expect(getByTestId("personal-info-section")).toBeInTheDocument();

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
     * And that next button points to experiences section
     */

    expect(
      getByText(new RegExp(nextTooltipText(Section.experiences)))
    ).toBeInTheDocument();
  });

  it("renders experiences section", () => {
    const location = {
      hash: makeUrlHashSegment(ResumePathHash.edit, Section.experiences),
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},
      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <ResumeFormP {...props} {...p} />
    )) as P;

    /**
     * Given user is on experiences section of update resume page
     */
    const { getByTestId, queryByTestId, getByText } = render(<Ui {...props} />);

    /**
     * Then user should see that experiences section is loaded on the page
     */
    expect(getByTestId("experiences-section")).toBeInTheDocument();

    /**
     * And that personal info section is not loaded on the page
     */
    expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();

    /**
     * And that previous button points to personal information section
     */

    expect(getByText(prevTooltipPersonalInfoRegexp)).toBeInTheDocument();

    /**
     * And that next button when hovered points to education section
     */
    expect(
      getByText(new RegExp(nextTooltipText(Section.education), "i"))
    ).toBeInTheDocument();
  });

  it("renders education section", () => {
    const location = {
      hash: makeUrlHashSegment(ResumePathHash.edit, Section.education),
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},
      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <ResumeFormP {...props} {...p} />
    )) as P;

    /**
     * Given user is on education section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(
      <Ui {...props} />
    );

    /**
     * Then user should see that education section is loaded on the page
     */
    expect(getByTestId("education-section")).toBeInTheDocument();

    /**
     * And that the experience section is not on the page
     */
    expect(queryByTestId("experiences-section")).not.toBeInTheDocument();

    /**
     * And that previous button no longer points to personal information section
     */
    expect(queryByText(prevTooltipPersonalInfoRegexp)).not.toBeInTheDocument();

    /**
     * And that the previous button now points to experiences section
     */

    expect(getByText(prevTooltipExperiencesRegexp)).toBeInTheDocument();

    /**
     * And that next button points to skills section
     */

    expect(
      getByText(new RegExp(nextTooltipText(Section.skills), "i"))
    ).toBeInTheDocument();
  });

  it("renders skills section", () => {
    const location = {
      hash: makeUrlHashSegment(ResumePathHash.edit, Section.skills),
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},
      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <ResumeFormP {...props} {...p} />
    )) as P;

    /**
     * Given user is on skills section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(
      <Ui {...props} />
    );

    /**
     * User should see that education section is gone from page
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

    expect(
      getByText(new RegExp(nextTooltipText(Section.addSkills), "i"))
    ).toBeInTheDocument();
  });

  it("renders additional skills section", () => {
    const location = {
      hash: makeUrlHashSegment(ResumePathHash.edit, Section.addSkills),
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},
      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <ResumeFormP {...props} {...p} />
    )) as P;

    /**
     * Given user is on additional skills section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(
      <Ui {...props} />
    );

    /**
     * Then user should see that skills section is gone from page
     */
    expect(queryByTestId("skills-section")).not.toBeInTheDocument();

    /**
     * And that additional skills section is now loaded unto the page
     */

    expect(getByTestId("additional-skills-section")).toBeInTheDocument();

    /**
     * And that the previous button no longer points to education sections
     */

    expect(
      queryByText(new RegExp(prevTooltipText(Section.education), "i"))
    ).not.toBeInTheDocument();

    /**
     * And that the previous button now points to skills section
     */
    const prevTooltipSkillsRegexp = new RegExp(prevTooltipText(Section.skills));

    expect(getByText(prevTooltipSkillsRegexp)).toBeInTheDocument();

    /**
     * And that next button points to languages section
     */

    expect(
      getByText(new RegExp(nextTooltipText(Section.langs)))
    ).toBeInTheDocument();
  });

  it("renders languages section", () => {
    const location = {
      hash: makeUrlHashSegment(ResumePathHash.edit, Section.langs),
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},
      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <ResumeFormP {...props} {...p} />
    )) as P;

    /**
     * Given user is on languages section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(
      <Ui {...props} />
    );

    /**
     * Then user should see that additional skills section is gone from page
     */
    expect(queryByTestId("additional-skills-section")).not.toBeInTheDocument();

    /**
     * And that languages section is now loaded unto the page
     */

    expect(getByTestId("languages-section")).toBeInTheDocument();

    /**
     * And that the previous button no longer points to skills sections
     */
    expect(
      queryByText(new RegExp(prevTooltipText(Section.skills)))
    ).not.toBeInTheDocument();

    /**
     * And that the previous button now points to additional skills section
     */
    const prevTooltipAddSkillsRegexp = new RegExp(
      prevTooltipText(Section.addSkills),
      "i"
    );
    expect(getByText(prevTooltipAddSkillsRegexp)).toBeInTheDocument();

    /**
     * And that next button points to hobbies section
     */

    expect(
      getByText(new RegExp(nextTooltipText(Section.hobbies), "i"))
    ).toBeInTheDocument();
  });

  it("renders hobbies section", () => {
    const location = {
      hash: makeUrlHashSegment(ResumePathHash.edit, Section.hobbies),
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},
      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <ResumeFormP {...props} {...p} />
    )) as P;

    /**
     * Given user is on hobbies section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(
      <Ui {...props} />
    );

    /**
     * Then user should see that languages section is gone from page
     */
    expect(queryByTestId("languages-section")).not.toBeInTheDocument();

    /**
     * And that hobbies section is now loaded unto the page
     */

    expect(getByTestId("hobbies-section")).toBeInTheDocument();

    /**
     * And that the previous button no longer points to additional skills sections
     */
    expect(
      queryByText(new RegExp(prevTooltipText(Section.addSkills), "i"))
    ).not.toBeInTheDocument();

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
      queryByText(new RegExp(uiTexts.partialPreviewResumeTooltipText, "i"))
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

  it("renders preview section", () => {
    const location = {
      hash: makeUrlHashSegment(ResumePathHash.edit, Section.preview),
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const props = {
      getResume: {},
      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <ResumeFormP {...props} {...p} />
    )) as P;

    /**
     * Given user is on preview section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(
      <Ui {...props} />
    );

    /**
     * Then user should see that personal info section is not on the page
     */
    expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();

    /**
     * And that preview resume section is loaded unto the page
     */
    expect(getByTestId("preview-resume-section")).toBeInTheDocument();

    /**
     * And that 'preview unfinished resume' button is not on the page
     */
    expect(
      queryByText(new RegExp(uiTexts.partialPreviewResumeTooltipText, "i"))
    ).not.toBeInTheDocument();

    /**
     * And that next button is not the page
     */
    expect(
      queryByText(new RegExp(nextTooltipText(Section.experiences)))
    ).not.toBeInTheDocument();

    /**
     * And that back to edit button is present on the page
     */
    expect(getByText(uiTexts.backToEditorBtnText)).toBeInTheDocument();
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
     * Given a user is on the update resume page
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
      location: {} as WindowLocation,
      loading: true
    } as Props;

    /**
     * Given a user is at the update resume page
     */
    const { getByText, queryByText } = render(<ResumeFormP {...props} />);

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
