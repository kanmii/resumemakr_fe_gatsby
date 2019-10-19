/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, fireEvent, wait, cleanup } from "@testing-library/react";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";
import {
  UpdateResumeForm,
  makeUrlHashSegment,
} from "../components/UpdateResumeForm/update-resume.component";
import {
  Props,
  formikConfig,
  Section,
} from "../components/UpdateResumeForm/update-resume.utils";
import { fillField } from "./test_utils";
import { makeResumeRoute, ResumePathHash } from "../routing";
import { GetResume_getResume } from "../graphql/apollo-types/GetResume";
import { makeAchievementId } from "../components/Experiences/experiences.dom-selectors";
import {
  makeInputId,
  makeAddId,
  makeRemoveId,
  makeMoveUpId,
  makeMoveDownId,
} from "../components/ListStrings/list-strings.dom-selectors";

jest.mock("../components/Preview", () => {
  return () => <div data-testid="preview-resume-section">1</div>;
});

jest.mock("../components/UpdateResumeForm/update-resume.injectables", () => ({
  debounceTime: 0,
}));

afterEach(() => {
  cleanup();
});

const initial = {
  experiences: [
    {
      index: 1,
      companyName: "c",
      position: "p",
      fromDate: "f",
      toDate: "t",
      achievements: ["a0", "a1", "a2"],
    },
  ],
} as GetResume_getResume;

it("adds achievement", async () => {
  const { ui, mockUpdateResume } = makeComp({
    getResume: initial,
  });

  render(ui);
  /**
   * When user clicks on achievement 0 add button
   */
  (document.getElementById(
    makeAddId(makeAchievementId(0)),
  ) as HTMLButtonElement).click();

  /**
   * Then user should see a newly added empty text box under achievement 0
   */
  const $achievement1 = document.getElementById(
    makeInputId(makeAchievementId(1)),
  ) as HTMLInputElement;

  expect($achievement1.value).toBe("");

  /**
   * And correct data should be sent to the server
   */

  await wait(() => {
    expect(
      mockUpdateResume.mock.calls[0][0].variables.input.experiences[0]
        .achievements,
    ).toEqual(["a0", "", "a1", "a2"]);
  });

  /**
   * When user fills achievement 1 with text
   */

  fillField($achievement1, "an");

  /**
   * And blurs the text field
   */
  fireEvent.blur($achievement1);

  /**
   * Then correct data should be sent to the server
   */
  await wait(() => {
    expect(
      mockUpdateResume.mock.calls[1][0].variables.input.experiences[0]
        .achievements,
    ).toEqual(["a0", "an", "a1", "a2"]);
  });
});

it("removes achievement", async () => {
  const { ui, mockUpdateResume } = makeComp({
    getResume: initial,
  });

  render(ui);

  /**
   * When user clicks on achievement 1 remove button
   */

  (document.getElementById(
    makeRemoveId(makeAchievementId(1)),
  ) as HTMLElement).click();

  /**
   * Then correct data should be sent to the server
   */

  await wait(() => {
    expect(
      mockUpdateResume.mock.calls[0][0].variables.input.experiences[0]
        .achievements,
    ).toEqual(["a0", "a2"]);
  });
});

it("swaps achievements up", async () => {
  const { ui, mockUpdateResume } = makeComp({
    getResume: initial,
  });

  render(ui);

  /**
   * When user clicks on 'move up' button of achievement 1
   */

  (document.getElementById(
    makeMoveUpId(makeAchievementId(1)),
  ) as HTMLElement).click();

  /**
   * Then correct data should be sent to the server
   */

  await wait(() => {
    expect(
      mockUpdateResume.mock.calls[0][0].variables.input.experiences[0]
        .achievements,
    ).toEqual(["a1", "a0", "a2"]);
  });
});

it("swaps achievements down", async () => {
  const { ui, mockUpdateResume } = makeComp({
    getResume: initial,
  });

  render(ui);

  /**
   * When user clicks on 'move down' button of achievement 1
   */

  (document.getElementById(
    makeMoveDownId(makeAchievementId(1)),
  ) as HTMLElement).click();

  /**
   * Then correct data should be sent to the server
   */
  await wait(() => {
    expect(
      mockUpdateResume.mock.calls[0][0].variables.input.experiences[0]
        .achievements,
    ).toEqual(["a0", "a2", "a1"]);
  });
});

////////////////////////////// HELPERS //////////////////////////////////////

const location = {
  hash: makeUrlHashSegment(ResumePathHash.edit, Section.experiences),
  pathname: makeResumeRoute("updates experiences", ""),
} as WindowLocation;

type P = React.ComponentType<Partial<Props>>;
const UpdateResumeP = UpdateResumeForm as P;

function makeComp(props: Partial<Props> = {}) {
  const C = withFormik(formikConfig)(p => (
    <UpdateResumeP {...p} {...props} />
  )) as P;

  const mockUpdateResume = jest.fn();

  return {
    ui: <C {...props} location={location} updateResume={mockUpdateResume} />,
    mockUpdateResume,
  };
}
