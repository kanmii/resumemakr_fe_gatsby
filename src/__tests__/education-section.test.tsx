// tslint:disable: no-any
import React, { ComponentType } from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import {
  render,
  fireEvent,
  wait,
  Matcher,
  MatcherOptions
} from "react-testing-library";
import { withFormik } from "formik";

import {
  UpdateResumeForm,
  makeUrlHashSegment
} from "../components/UpdateResumeForm/component";
import { Props, Section } from "../components/UpdateResumeForm/utils";
import { formikConfig } from "../components/UpdateResumeForm/utils";
import { WindowLocation } from "@reach/router";
import { ResumePathHash, makeResumeRoute } from "../routing";
import {
  GetResume_getResume,
  GetResume_getResume_education
} from "../graphql/apollo/types/GetResume";
import {
  makeListDisplayCtrlTestId,
  ListDisplayCtrlNames
} from "../components/components";
import {
  eduFieldName,
  makeEduFieldName,
  uiTexts
} from "../components/Education/utils";
import {
  makeListStringHiddenLabelText,
  makeListStringFieldName
} from "../components/ListStrings";
import { fillField } from "./test_utils";

let getByTestId: (
  text: Matcher,
  options?: MatcherOptions | undefined
) => HTMLElement;

let mockUpdateResume: jest.Mock;

describe("changing number", () => {
  beforeEach(() => {
    const education = [
      {
        course: "c0"
      },
      {
        course: "c1"
      },
      { course: "c2" }
    ] as GetResume_getResume_education[];

    const formValues = { education } as GetResume_getResume;

    const comp = makeComp({
      getResume: formValues
    });

    mockUpdateResume = comp.mockUpdateResume;

    /**
     * Given user is at education section of update resume form
     */

    const renderArgs = render(comp.ui);

    getByTestId = renderArgs.getByTestId;
  });

  describe("adding education", () => {
    it("from top", async () => {
      /**
       * When user clicks add button of skill 0
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(eduFieldName, ListDisplayCtrlNames.add, 0)
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c0", "", "c1", "c2"]);
        },
        { interval: 1 }
      );
    });

    it("in middle", async () => {
      /**
       * When user clicks add button of skill 1
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(eduFieldName, ListDisplayCtrlNames.add, 1)
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c0", "c1", "", "c2"]);
        },
        { interval: 1 }
      );
    });

    it("at bottom", async () => {
      /**
       * When user clicks add button of skill 2
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(eduFieldName, ListDisplayCtrlNames.add, 2)
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c0", "c1", "c2", ""]);
        },
        { interval: 1 }
      );
    });
  });

  describe("deleting education", () => {
    it("from top", async () => {
      /**
       * When user clicks remove button of skill 0
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(
            eduFieldName,
            ListDisplayCtrlNames.remove,
            0
          )
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c1", "c2"]);
        },
        { interval: 1 }
      );
    });

    it("in middle", async () => {
      /**
       * When user clicks remove button of skill 1
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(
            eduFieldName,
            ListDisplayCtrlNames.remove,
            1
          )
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c0", "c2"]);
        },
        { interval: 1 }
      );
    });

    it("at bottom", async () => {
      /**
       * When user clicks remove button of skill 2
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(
            eduFieldName,
            ListDisplayCtrlNames.remove,
            2
          )
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c0", "c1"]);
        },
        { interval: 1 }
      );
    });
  });

  describe("swapping education up", () => {
    it("from middle", async () => {
      /**
       * When user clicks move up button of skill 1
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(
            eduFieldName,
            ListDisplayCtrlNames.moveUp,
            1
          )
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c1", "c0", "c2"]);
        },
        { interval: 1 }
      );
    });

    it("from bottom", async () => {
      /**
       * When user clicks move up button of skill 2
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(
            eduFieldName,
            ListDisplayCtrlNames.moveUp,
            2
          )
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c0", "c2", "c1"]);
        },
        { interval: 1 }
      );
    });
  });

  describe("swapping education down", () => {
    it("from top", async () => {
      /**
       * When user clicks move down button of skill 0
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(
            eduFieldName,
            ListDisplayCtrlNames.moveDown,
            0
          )
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c1", "c0", "c2"]);
        },
        { interval: 1 }
      );
    });

    it("from bottom", async () => {
      /**
       * When user clicks move down button of skill 1
       */
      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(
            eduFieldName,
            ListDisplayCtrlNames.moveDown,
            1
          )
        )
      );

      /**
       * Then the right data should be sent to the server
       */
      await wait(
        () => {
          expect(
            getCourses(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input
                .education
            )
          ).toEqual(["c0", "c2", "c1"]);
        },
        { interval: 1 }
      );
    });
  });
});

it("updates education on blur", async () => {
  const education = [
    {
      course: "a",
      achievements: ["a0", "a1", "a2"]
    }
  ] as GetResume_getResume_education[];

  const formValues = { education } as GetResume_getResume;

  const comp = makeComp({ getResume: formValues });
  mockUpdateResume = comp.mockUpdateResume;

  /**
   * Given user is on education section of update resume form
   */
  const { getByLabelText } = render(comp.ui);

  /**
   * When user edits the course field
   */
  const $course = getByLabelText(makeEduFieldName(0, "course"));
  fillField($course, "b");

  /**
   * And user blurs the course field
   */
  fireEvent.blur($course);

  /**
   * Then correct data should be sent to the server
   */
  await wait(
    () => {
      expect(
        (mockUpdateResume.mock.calls[0][0] as any).variables.input.education[0]
          .course
      ).toBe("b");
    },
    { interval: 1 }
  );

  /**
   * When user edits achievement 1
   */
  const $achievement1 = getByLabelText(
    makeListStringHiddenLabelText(
      makeListStringFieldName(makeEduFieldName(0, "achievements"), 1),
      uiTexts.achievementsHiddenLabel
    )
  );

  fillField($achievement1, "a10");

  /**
   * And user blurs achievement 1
   */
  fireEvent.blur($achievement1);

  /**
   * Then correct data should be uploaded to the server
   */
  await wait(
    () => {
      expect(
        (mockUpdateResume.mock.calls[1][0] as any).variables.input.education[0]
          .achievements
      ).toEqual(["a0", "a10", "a2"]);
    },
    { interval: 1 }
  );
});

type P = ComponentType<Partial<Props>>;
const UpdateResumeFormP = UpdateResumeForm as any;
const location = {
  hash: makeUrlHashSegment(ResumePathHash.edit, Section.education),
  pathname: makeResumeRoute("title")
} as WindowLocation;

function makeComp(props: Partial<Props> = {}) {
  const C = withFormik(formikConfig)(p => (
    <UpdateResumeFormP {...p} {...props} />
  )) as P;

  mockUpdateResume = jest.fn();

  return {
    ui: <C {...props} location={location} updateResume={mockUpdateResume} />,
    mockUpdateResume
  };
}

function getCourses(education: GetResume_getResume_education[]) {
  return education.map(s => s.course);
}
