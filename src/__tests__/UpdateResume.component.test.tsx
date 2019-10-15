/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
  Section,
  uiTexts,
} from "../components/UpdateResumeForm/update-resume.utils";
import {
  fillField,
  uploadFile,
  createFile,
  jpegMime,
  jpegBase64StringPrefix,
  renderWithRouter,
} from "./test_utils";
import { makeResumeRoute, ResumePathHash } from "../routing";
import { GetResume_getResume } from "../graphql/apollo-types/GetResume";
import { ALREADY_UPLOADED } from "../constants";
import {
  gqlErrorId,
  loadingTooLongId,
  previousBtnId,
  nextBtnId,
  additionalSkillsId,
  languagesId,
  hobbiesId,
  partialPreviewBtnId,
  backToEditBtnId,
} from "../components/UpdateResumeForm/update-resume.dom-selectors";
import {
  previewId,
  fileChooser,
  deletePhotoId,
  stopPhotoDeleteId,
} from "../components/PhotoField/photo-field.dom-selectors";
import {
  prefix as personalInfoId,
  addressFieldId,
} from "../components/PersonalInfo/personal-info.dom-selectors";
import { prefix as educationId } from "../components/Education/education.dom-selectors";
import { prefix as experiencesId } from "../components/Experiences/experiences.dom-selectors";
import { prefix as skillsId } from "../components/Skills/skills.dom-selectors";
import { prefix as mockPreviewSectionId } from "../components/Preview/preview.dom-selectors";

type P = React.ComponentType<Partial<Props>>;
const ResumeFormP = UpdateResumeForm as P;

jest.mock("../components/Preview", () => ({
  Preview: jest.fn(() => <div id={mockPreviewSectionId} />),
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
  jest.runAllTimers();
  cleanup();
  jest.clearAllTimers();
});

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
  render(ui);

  /**
   * Then user should see that experiences section is loaded on the page
   */
  expect(document.getElementById(experiencesId)).not.toBeNull();

  /**
   * And that personal info section is not loaded on the page
   */
  expect(document.getElementById(personalInfoId)).toBeNull()

  /**
   * And that previous button points to personal information section
   */

  expect(
    (document.getElementById(previousBtnId) as HTMLElement).textContent,
  ).toContain(Section.personalInfo);

  /**
   * And that next button when hovered points to education section
   */
  expect(
    (document.getElementById(nextBtnId) as HTMLElement).textContent,
  ).toContain(Section.education);
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
  render(ui);

  /**
   * Then user should see that education section is loaded on the page
   */
  expect(document.getElementById(educationId)).not.toBeNull();

  /**
   * And that the experience section is not on the page
   */
  expect(document.getElementById(experiencesId)).toBeNull();

  /**
   * And that the previous button now points to experiences section
   */

  expect(
    (document.getElementById(previousBtnId) as HTMLElement).textContent,
  ).toContain(Section.experiences);

  /**
   * And that next button points to skills section
   */

  expect(
    (document.getElementById(nextBtnId) as HTMLElement).textContent,
  ).toContain(Section.skills);
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
  render(ui);

  /**
   * User should see that education section is gone from page
   */
  expect(document.getElementById(educationId)).toBeNull();

  /**
   * And that skills section is now loaded unto the page
   */

  expect(document.getElementById(skillsId)).not.toBeNull();

  /**
   * And that the previous button now points to education section
   */

  expect(
    (document.getElementById(previousBtnId) as HTMLElement).textContent,
  ).toContain(Section.education);

  /**
   * And that next button points to additional skills section
   */

  expect(
    (document.getElementById(nextBtnId) as HTMLElement).textContent,
  ).toContain(Section.addSkills);
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
  render(ui);

  /**
   * Then user should see that skills section is gone from page
   */
  expect(document.getElementById(skillsId)).toBeNull();

  /**
   * And that additional skills section is now loaded unto the page
   */

  expect(document.getElementById(additionalSkillsId)).not.toBeNull();

  /**
   * And that the previous button now points to skills section
   */

  expect(
    (document.getElementById(previousBtnId) as HTMLElement).textContent,
  ).toContain(Section.skills);

  /**
   * And that next button points to languages section
   */

  expect(
    (document.getElementById(nextBtnId) as HTMLElement).textContent,
  ).toContain(Section.langs);
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
  render(ui);

  /**
   * Then user should see that additional skills section is gone from page
   */
  expect(document.getElementById(additionalSkillsId)).toBeNull();

  /**
   * And that languages section is now loaded unto the page
   */

  expect(document.getElementById(languagesId)).not.toBeNull()

  /**
   * And that the previous button now points to additional skills section
   */
  expect(
    (document.getElementById(previousBtnId) as HTMLElement).textContent,
  ).toContain(Section.addSkills);

  /**
   * And that next button points to hobbies section
   */

  expect(
    (document.getElementById(nextBtnId) as HTMLElement).textContent,
  ).toContain(Section.hobbies);
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
  render(ui);

  /**
   * Then user should see that languages section is gone from page
   */
  expect(document.getElementById(languagesId)).toBeNull();

  /**
   * And that hobbies section is now loaded unto the page
   */

  expect(document.getElementById(hobbiesId)).not.toBeNull()

  /**
   * And that the previous button now points to languages section
   */

  expect(
    (document.getElementById(previousBtnId) as HTMLElement).textContent,
  ).toContain(Section.langs);

  /**
   * And that preview unfinished resume button is no longer
   * present on the page
   */
  expect(document.getElementById(partialPreviewBtnId)).toBeNull();

  /**
   * And that next button points to preview resume section, signalling end
   * of navigation
   */

  expect(
    (document.getElementById(nextBtnId) as HTMLElement).textContent,
  ).toContain(uiTexts.endPreviewResumeTooltipText);
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
  render(ui);

  /**
   * Then user should see that personal info section is not on the page
   */
  expect(document.getElementById(personalInfoId)).toBeNull();

  /**
   * And that preview resume section is loaded unto the page
   */
  expect(document.getElementById(mockPreviewSectionId)).not.toBeNull();

  /**
   * And that 'preview unfinished resume' button is not on the page
   */
  expect(document.getElementById(partialPreviewBtnId)).toBeNull();

  /**
   * And that next button is not on the page
   */
  expect(document.getElementById(nextBtnId)).toBeNull();

  /**
   * And that back to edit button is present on the page
   */
  expect(document.getElementById(backToEditBtnId)).not.toBeNull();
  //jest.runAllTimers();
});

it("shows loading takes too long", async () => {
  const { ui } = makeComp({
    loading: true,
  });

  /**
   * Given a user is at the update resume page
   */
  const {} = render(ui);

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

  /**
   * Then user should see message that loading is taking too long
   */
  jest.runAllTimers();
  expect(document.getElementById(loadingTooLongId)).not.toBeNull();

  /**
   * But user should no longer see loading indicator
   */

  expect(document.getElementById(mockLoadingId)).toBeNull();
  //debug();
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
  render(ui);

  /**
   * And user edits the address field
   */
  const $address = document.getElementById(addressFieldId) as HTMLElement;
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
  const $photoPreview = await waitForElement(() => {
    return document.getElementById(previewId) as HTMLElement;
  });

  fireEvent.mouseOver($photoPreview);
  (document.getElementById(deletePhotoId) as HTMLElement).click();

  (document.getElementById(stopPhotoDeleteId) as HTMLElement).click();
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
  const errorMessage = "a";

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
  render(ui);

  /**
   * Then user should not see any error message
   */
  expect(document.getElementById(gqlErrorId)).toBeNull();

  /**
   * When user completes the address input
   */
  const $address = document.getElementById(addressFieldId) as HTMLElement;
  fillField($address, "a");

  /**
   * And user blurs the address field
   */
  fireEvent.blur($address);
  jest.runAllTimers();

  /**
   * Then data should be uploaded to server
   */

  await wait(() => {
    expect(
      mockUpdateResume.mock.calls[0][0].variables.input.personalInfo.address,
    ).toEqual("a");
  });

  /**
   * And user should see an error message
   */
  expect(document.getElementById(gqlErrorId)).not.toBeNull();
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

  let Ui = withFormik(formikConfig)(Urouter) as any;

  return {
    ui: (
      <Ui updateResume={mockUpdateResume} match={{ title: "t" }} {...props} />
    ),
    mockUpdateResume,
    ...rest,
  };
}
