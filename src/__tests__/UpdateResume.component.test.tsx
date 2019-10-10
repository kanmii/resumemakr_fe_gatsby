/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "jest-dom/extend-expect";
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  cleanup,
} from "@testing-library/react";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";
import {
  UpdateResumeForm,
  makeUrlHashSegment,
  isBase64String,
} from "../components/UpdateResumeForm/update-resume.component";
import {
  Props,
  formikConfig,
  nextTooltipText,
  Section,
  prevTooltipText,
  uiTexts,
} from "../components/UpdateResumeForm/update-resume.utils";
import {
  renderWithApollo,
  fillField,
  uploadFile,
  createFile,
  jpegMime,
  jpegBase64StringPrefix,
  renderWithRouter,
} from "./test_utils";
import { makeResumeRoute, ResumePathHash } from "../routing";
import { uiTexts as personalInfoUiTexts } from "../components/PersonalInfo/utils";
import { GetResume_getResume } from "../graphql/apollo/types/GetResume";
import { ALREADY_UPLOADED } from "../constants";
import {
  gqlErrorId,
  loadingTooLongId,
  previousBtnId,
  nextBtnId,
} from "../components/UpdateResumeForm/update-resume.dom-selectors";
import {
  previewId,
  fileChooser,
  deletePhotoId,
  stopPhotoDeleteId,
} from "../components/PhotoField/photo-field.dom-selectors";
import { prefix as personalInfoId } from "../components/PersonalInfo/personal-info.dom-selectors";
import { prefix as educationId } from "../components/Education/education.dom-selectors";
import { prefix as experiencesId } from "../components/Experiences/experiences.dom-selectors";

type P = React.ComponentType<Partial<Props>>;
const ResumeFormP = UpdateResumeForm as P;

jest.mock("../components/Preview", () => ({
  Preview: jest.fn(() => <div data-testid="preview-resume-section">1</div>),
}));

const mockLoadingId = "lolo";

jest.mock("../components/Loading", () => ({
  Loading: () => <div id={mockLoadingId} />,
}));

jest.mock("../components/UpdateResumeForm/update-resume.injectables", () => ({
  debounceTime: 0,
}));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  cleanup();
});

describe("Resume form sections", () => {
  const prevTooltipPersonalInfoRegexp = new RegExp(
    prevTooltipText(Section.personalInfo),
    "i",
  );

  const prevTooltipExperiencesRegexp = new RegExp(
    prevTooltipText(Section.experiences),
  );

  it("renders loading error", () => {
    /**
     * Given user is on update resume page
     */

    const { ui } = makeComp({
      error: new ApolloError({
        networkError: new Error(""),
      }),
    });

    render(ui);

    /**
     * Then user should see network error
     */
    expect(document.getElementById(gqlErrorId)).not.toBeNull();

    /**
     * And not see loading indicator
     */

    expect(document.getElementById(mockLoadingId)).toBeNull();
  });

  it("renders loading indicator", () => {
    /**
     * Given data is still being loaded
     */
    const { ui } = makeComp({
      loading: true,
    });

    /**
     * When component is rendered
     */

    render(ui);

    /**
     * Then user should see loading indicator
     */
    expect(document.getElementById(mockLoadingId)).not.toBeNull();
  });

  it("renders personal info section", () => {
    /**
     * Given user is on personal info section of update resume page
     */
    const { ui } = makeComp({
      getResume: {} as GetResume_getResume,
      location: {
        hash: "",
        pathname: makeResumeRoute("first resume", ""),
      } as WindowLocation,
    });

    render(ui);

    /**
     * Then user should see that personal info section is loaded on the page
     */
    expect(document.getElementById(personalInfoId)).not.toBeNull();

    /**
     * And that education section is not loaded on the page
     */
    expect(document.getElementById(educationId)).toBeNull();

    /**
     * And that 'go to previous section' button is not present on the page
     */
    expect(document.getElementById(previousBtnId)).toBeNull();

    /**
     * And that next button points to experiences section
     */

    expect(
      (document.getElementById(nextBtnId) as HTMLElement).textContent,
    ).toContain(Section.experiences);
  });

  it("renders experiences section", () => {
    const { ui } = makeComp({
      getResume: {},
      location: {
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.experiences),
        pathname: makeResumeRoute("first resume", ""),
      } as WindowLocation,
    } as Partial<Props>);
    /**
     * Given user is on experiences section of update resume page
     */
    const { queryByTestId, getByText } = render(ui);

    /**
     * Then user should see that experiences section is loaded on the page
     */
    expect(document.getElementById(experiencesId)).not.toBeNull();

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
      getByText(new RegExp(nextTooltipText(Section.education), "i")),
    ).toBeInTheDocument();
  });

  it("renders education section", () => {
    const { ui } = makeComp({
      getResume: {},
      location: {
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.education),
        pathname: makeResumeRoute("first resume", ""),
      } as WindowLocation,
    } as Partial<Props>);
    /**
     * Given user is on education section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(ui);

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
      getByText(new RegExp(nextTooltipText(Section.skills), "i")),
    ).toBeInTheDocument();
  });

  it("renders skills section", () => {
    const { ui } = makeComp({
      getResume: {},
      location: {
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.skills),
        pathname: makeResumeRoute("first resume", ""),
      } as WindowLocation,
    } as Partial<Props>);

    /**
     * Given user is on skills section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(ui);

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
      "i",
    );

    expect(getByText(prevTooltipEduRegexp)).toBeInTheDocument();

    /**
     * And that next button points to additional skills section
     */

    expect(
      getByText(new RegExp(nextTooltipText(Section.addSkills), "i")),
    ).toBeInTheDocument();
  });

  it("renders additional skills section", () => {
    const { ui } = makeComp({
      getResume: {},
      location: {
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.addSkills),
        pathname: makeResumeRoute("first resume", ""),
      } as WindowLocation,
    } as Partial<Props>);

    /**
     * Given user is on additional skills section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(ui);

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
      queryByText(new RegExp(prevTooltipText(Section.education), "i")),
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
      getByText(new RegExp(nextTooltipText(Section.langs))),
    ).toBeInTheDocument();
  });

  it("renders languages section", () => {
    const { ui } = makeComp({
      getResume: {},
      location: {
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.langs),
        pathname: makeResumeRoute("first resume", ""),
      } as WindowLocation,
    } as Partial<Props>);

    /**
     * Given user is on languages section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(ui);

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
      queryByText(new RegExp(prevTooltipText(Section.skills))),
    ).not.toBeInTheDocument();

    /**
     * And that the previous button now points to additional skills section
     */
    const prevTooltipAddSkillsRegexp = new RegExp(
      prevTooltipText(Section.addSkills),
      "i",
    );
    expect(getByText(prevTooltipAddSkillsRegexp)).toBeInTheDocument();

    /**
     * And that next button points to hobbies section
     */

    expect(
      getByText(new RegExp(nextTooltipText(Section.hobbies), "i")),
    ).toBeInTheDocument();
  });

  it("renders hobbies section", () => {
    const { ui } = makeComp({
      getResume: {},
      location: {
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.hobbies),
        pathname: makeResumeRoute("first resume", ""),
      } as WindowLocation,
    } as Partial<Props>);

    /**
     * Given user is on hobbies section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(ui);

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
      queryByText(new RegExp(prevTooltipText(Section.addSkills), "i")),
    ).not.toBeInTheDocument();

    /**
     * And that the previous button now points to languages section
     */
    const prevTooltipLangsRegexp = new RegExp(
      prevTooltipText(Section.langs),
      "i",
    );

    expect(getByText(prevTooltipLangsRegexp)).toBeInTheDocument();

    /**
     * And that preview unfinished resume button is no longer
     * present on the page
     */
    expect(
      queryByText(new RegExp(uiTexts.partialPreviewResumeTooltipText, "i")),
    ).not.toBeInTheDocument();

    /**
     * And that next button points to preview resume section, signalling end
     * of navigation
     */
    const endPreviewResumeTooltipRegexp = new RegExp(
      uiTexts.endPreviewResumeTooltipText,
      "i",
    );

    expect(getByText(endPreviewResumeTooltipRegexp)).toBeInTheDocument();
  });

  it("renders preview section", () => {
    const { ui } = makeComp({
      getResume: {},
      location: {
        hash: makeUrlHashSegment(ResumePathHash.edit, Section.preview),
        pathname: makeResumeRoute("first resume", ""),
      } as WindowLocation,
    } as Partial<Props>);

    /**
     * Given user is on preview section of update resume page
     */
    const { getByTestId, queryByTestId, getByText, queryByText } = render(ui);

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
      queryByText(new RegExp(uiTexts.partialPreviewResumeTooltipText, "i")),
    ).not.toBeInTheDocument();

    /**
     * And that next button is not the page
     */
    expect(
      queryByText(new RegExp(nextTooltipText(Section.experiences))),
    ).not.toBeInTheDocument();

    /**
     * And that back to edit button is present on the page
     */
    expect(getByText(uiTexts.backToEditorBtnText)).toBeInTheDocument();
  });
});

describe("update logic", () => {
  it("shows loading takes too long", async () => {
    const { ui } = makeComp({
      loading: true,
    });

    /**
     * Given a user is at the update resume page
     */
    render(ui);

    /**
     * Then user should see loading indicator
     */
    expect(document.getElementById(mockLoadingId)).not.toBeNull();

    /**
     * And user should not see UI showing loading taking forever
     */

    expect(document.getElementById(loadingTooLongId)).toBeNull();

    /**
     * After a while
     */
    jest.runAllTimers();

    /**
     * Then user should see message that loading is taking too long
     */
    expect(document.getElementById(loadingTooLongId)).not.toBeNull();

    /**
     * But user should no longer see loading indicator
     */

    expect(document.getElementById(mockLoadingId)).toBeNull();
  });

  it("flags photo to server if photo not changed on client", async () => {
    const { ui, mockUpdateResume } = makeComp({
      location: {
        hash: "",
        pathname: makeResumeRoute("something", ""),
      } as WindowLocation,

      getResume: {
        personalInfo: { photo: "lll.jpg" },
      } as GetResume_getResume,
    } as Props);

    /**
     * Given a user is on the update resume page
     */
    const { getByLabelText } = render(ui);

    /**
     * And user edits the address field
     */
    const $address = getByLabelText(personalInfoUiTexts.addressLabel);
    fillField($address, "a");

    /**
     * And user blurs the address field
     */
    fireEvent.blur($address);
    jest.runAllTimers();

    /**
     * Then updated data should be uploaded to server with photo field flagged
     */

    await wait(() => {
      expect(
        (mockUpdateResume.mock.calls[0][0] as any).variables.input.personalInfo
          .photo,
      ).toEqual(ALREADY_UPLOADED);
    });
  });

  it("uploads new photo as base64 encoded string", async done => {
    const { ui, mockUpdateResume } = makeComp({
      location: {
        hash: "",
        pathname: makeResumeRoute("something", ""),
      } as WindowLocation,

      getResume: {} as GetResume_getResume,
    } as Props);

    /**
     * Given a user is at the update resume page
     */
    render(ui);

    /**
     * And user selects a photo
     */
    const $photo = document.getElementById(fileChooser) as HTMLInputElement;

    uploadFile($photo, createFile("dog.jpg", 1234, jpegMime));
    jest.runAllTimers();

    /**
     * Then updated data should be uploaded to server with encoded photo
     */

    await wait(() => {
      jest.runAllTimers();

      expect(
        (mockUpdateResume.mock.calls[0][0] as any).variables.input.personalInfo
          .photo,
      ).toEqual(jpegBase64StringPrefix);
    });

    done();
  });

  it("deletes photo", async done => {
    const { ui, mockUpdateResume } = makeComp({
      location: {
        hash: "",
        pathname: makeResumeRoute("something", ""),
      } as WindowLocation,

      getResume: {
        personalInfo: {
          photo: "pho.jpg",
        },
      } as GetResume_getResume,
    } as Props);

    /**
     * Given a user is at the update resume page
     */

    render(ui);

    /**
     * And user deletes photo
     */
    jest.runAllTimers();
    const $photoPreview = await waitForElement(() => {
      return document.getElementById(previewId) as HTMLElement;
    });

    fireEvent.mouseOver($photoPreview);
    (document.getElementById(deletePhotoId) as HTMLElement).click();

    fireEvent.click(document.getElementById(stopPhotoDeleteId) as HTMLElement);

    jest.runAllTimers();

    /**
     * Then updated data should be uploaded to server with photo set to null
     */

    await wait(() => {
      expect(
        mockUpdateResume.mock.calls[0][0].variables.input.personalInfo.photo,
      ).toBeNull();
    });

    done();
  });

  it("renders update error", async () => {
    const errorMessage = "You are not allowed to";

    const { ui, mockUpdateResume } = makeComp({
      location: {
        hash: "",
        pathname: makeResumeRoute("something", ""),
      } as WindowLocation,

      getResume: {},
    } as Props);

    mockUpdateResume.mockRejectedValue(
      new ApolloError({
        graphQLErrors: [new GraphQLError(errorMessage)],
      }),
    );

    /**
     * Given a user is at the update resume page
     */
    const { getByLabelText, queryByText, getByText } = render(ui);

    /**
     * Then user should not see any error message
     */
    expect(queryByText(errorMessage)).not.toBeInTheDocument();

    /**
     * When user completes the address input
     */
    const $address = getByLabelText(personalInfoUiTexts.addressLabel);
    fillField($address, "a");

    /**
     * And user blurs the address field
     */
    fireEvent.blur($address);

    /**
     * Then data should be uploaded to server
     */

    await wait(
      () => {
        jest.runAllTimers();

        expect(
          mockUpdateResume.mock.calls[0][0].variables.input.personalInfo
            .address,
        ).toEqual("a");
      },
      { interval: 1 },
    );

    /**
     * And user should not see an error message
     */
    expect(getByText(errorMessage)).toBeInTheDocument();
  });
});

describe("isBase64String", () => {
  it("returns false if input does not start with correct string", () => {
    expect(isBase64String("ab")).toBe(false);
  });

  it("returns false if input is not base64 encoded", () => {
    expect(isBase64String("data:image/jpeg;ab")).toBe(false);
  });

  it("returns true for base64 encoded encoded string", () => {
    expect(isBase64String("data:image/jpeg;base64,ab")).toBe(true);
  });
});

////////////////////////// HELPERS ////////////////////////////

function makeComp(props: Partial<Props> = {}) {
  const mockUpdateResume = jest.fn();
  let { Ui: Urouter, ...rest } = renderWithRouter(ResumeFormP);
  const Uapollo = renderWithApollo(Urouter, props).Ui;

  let Ui = withFormik(formikConfig)(Uapollo) as any;

  return {
    ui: (
      <Ui updateResume={mockUpdateResume} match={{ title: "t" }} {...props} />
    ),
    mockUpdateResume,
    ...rest,
  };
}
