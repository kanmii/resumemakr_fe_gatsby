/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentType } from "react";
import { render, wait, cleanup } from "@testing-library/react";
import { withFormik } from "formik";
import {
  UpdateResumeForm,
  makeUrlHashSegment,
} from "../components/UpdateResumeForm/update-resume.component";
import {
  Props,
  Section,
  formikConfig,
} from "../components/UpdateResumeForm/update-resume.utils";
import { WindowLocation } from "@reach/router";
import { ResumePathHash, makeResumeRoute } from "../routing";
import {
  GetResume_getResume,
  GetResume_getResume_education,
} from "../graphql/apollo/types/GetResume";
import { fillField } from "./test_utils";
import {
  makeControlsId,
  makeCourseInputId,
  makeAchievementId,
} from "../components/Education/education.dom-selectors";
import {
  makeAddId,
  makeRemoveId,
  makeMoveUpId,
  makeMoveDownId,
} from "../components/IterableControls/iterable-controls.dom-selectors";
import { makeInputId as makeListStringInputId } from "../components/ListStrings/list-strings.dom-selectors";

jest.mock("../components/UpdateResumeForm/update-resume.injectables", () => ({
  debounceTime: 0,
}));

afterEach(() => {
  cleanup();
});

const education = [
  {
    course: "c0",
  },
  {
    course: "c1",
  },
  { course: "c2" },
] as GetResume_getResume_education[];

const blurEvent = new FocusEvent("blur", {
  bubbles: false,
  cancelable: false,
});

describe("adding education", () => {
  it("from top", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);
    const controlsId = makeControlsId(0);

    /**
     * When user clicks add button of skill 0
     */

    (document.getElementById(makeAddId(controlsId)) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c0", "", "c1", "c2"]);
    });
  });

  it("in middle", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);
    const controlsId = makeControlsId(1);

    /**
     * When user clicks add button of skill 1
     */

    (document.getElementById(makeAddId(controlsId)) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c0", "c1", "", "c2"]);
    });
  });

  it("at bottom", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);

    /**
     * When user clicks add button of skill 2
     */

    const controlsId = makeControlsId(2);
    (document.getElementById(makeAddId(controlsId)) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c0", "c1", "c2", ""]);
    });
  });
});

describe("deleting education", () => {
  it("from top", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);

    /**
     * When user clicks remove button of skill 0
     */

    const controlsId = makeControlsId(0);
    (document.getElementById(makeRemoveId(controlsId)) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c1", "c2"]);
    });
  });

  it("in middle", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);

    /**
     * When user clicks remove button of skill 1
     */

    const controlsId = makeControlsId(1);
    (document.getElementById(makeRemoveId(controlsId)) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c0", "c2"]);
    });
  });

  it("at bottom", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);

    /**
     * When user clicks remove button of skill 2
     */

    const controlsId = makeControlsId(2);
    (document.getElementById(makeRemoveId(controlsId)) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c0", "c1"]);
    });
  });
});

describe("swapping education up", () => {
  it("from middle", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);

    /**
     * When user clicks move up button of skill 1
     */

    const controlsId = makeControlsId(1);
    (document.getElementById(makeMoveUpId(controlsId)) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c1", "c0", "c2"]);
    });
  });

  it("from bottom", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);

    /**
     * When user clicks move up button of skill 2
     */

    const controlsId = makeControlsId(2);
    (document.getElementById(makeMoveUpId(controlsId)) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c0", "c2", "c1"]);
    });
  });
});

describe("swapping education down", () => {
  it("from top", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);

    /**
     * When user clicks move down button of skill 0
     */

    const controlsId = makeControlsId(0);
    (document.getElementById(
      makeMoveDownId(controlsId),
    ) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c1", "c0", "c2"]);
    });
  });

  it("from bottom", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: { education } as GetResume_getResume,
    });

    /**
     * Given user is at education section of update resume form
     */

    render(ui);

    /**
     * When user clicks move down button of skill 1
     */

    const controlsId = makeControlsId(1);
    (document.getElementById(
      makeMoveDownId(controlsId),
    ) as HTMLElement).click();

    /**
     * Then the right data should be sent to the server
     */
    await wait(() => {
      expect(
        getCourses(
          (mockUpdateResume.mock.calls[0][0] as any).variables.input.education,
        ),
      ).toEqual(["c0", "c2", "c1"]);
    });
  });
});

it("updates education on blur", async () => {
  const education = [
    {
      course: "a",
      achievements: ["a0", "a1", "a2"],
    },
  ] as GetResume_getResume_education[];

  const formValues = { education } as GetResume_getResume;

  const { ui, mockUpdateResume } = makeComp({ getResume: formValues });

  /**
   * Given user is on education section of update resume form
   */
  render(ui);

  /**
   * When user edits the course field
   */
  const $course = document.getElementById(makeCourseInputId(0)) as HTMLElement;
  fillField($course, "b");

  /**
   * And user blurs the course field
   */

  $course.dispatchEvent(blurEvent);

  /**
   * Then correct data should be sent to the server
   */
  await wait(() => {
    expect(
      (mockUpdateResume.mock.calls[0][0] as any).variables.input.education[0]
        .course,
    ).toBe("b");
  });

  const achievementId = makeListStringInputId(makeAchievementId(1));

  /**
   * When user edits achievement 1
   */
  const $achievement1 = document.getElementById(achievementId) as HTMLElement;
  fillField($achievement1, "a10");

  /**
   * And user blurs achievement 1
   */
  $achievement1.dispatchEvent(blurEvent);

  /**
   * Then correct data should be uploaded to the server
   */
  await wait(() => {
    expect(
      (mockUpdateResume.mock.calls[1][0] as any).variables.input.education[0]
        .achievements,
    ).toEqual(["a0", "a10", "a2"]);
  });
});

////////////////////////// HELPERS ////////////////////////////

type P = ComponentType<Partial<Props>>;
const UpdateResumeP = UpdateResumeForm as any;

const location = {
  hash: makeUrlHashSegment(ResumePathHash.edit, Section.education),
  pathname: makeResumeRoute("title"),
} as WindowLocation;

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

function getCourses(education: GetResume_getResume_education[]) {
  return education.map(s => s.course);
}
