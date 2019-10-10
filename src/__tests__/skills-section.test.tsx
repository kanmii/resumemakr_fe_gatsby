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
import { WindowLocation } from "@reach/router";
import {
  UpdateResumeForm,
  makeUrlHashSegment
} from "../components/UpdateResumeForm/update-resume.component";
import {
  makeSkillFieldName,
  uiTexts,
  emptyVal,
  fieldName
} from "../components/Skills/utils";
import {
  Props,
  formikConfig,
  Section
} from "../components/UpdateResumeForm/update-resume.utils";
import { ResumePathHash, makeResumeRoute } from "../routing";
import {
  makeListStringHiddenLabelText,
  makeListStringFieldName
} from "../components/ListStrings";
import { fillField } from "./test_utils";
import {
  makeListDisplayCtrlTestId,
  ListDisplayCtrlNames
} from "../components/components";

type P = ComponentType<Partial<Props>>;
const UpdateResumeFormP = UpdateResumeForm as P;
const location = {
  hash: makeUrlHashSegment(ResumePathHash.edit, Section.skills),
  pathname: makeResumeRoute("title")
} as WindowLocation;

let mockUpdateResume: jest.Mock;

describe("basics", () => {
  it("updates server on input blur", async () => {
    mockUpdateResume = jest.fn();

    const props = {
      getResume: {
        skills: [emptyVal]
      },

      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <UpdateResumeFormP {...p} {...props} />
    )) as P;

    /**
     * Given that user is on skills section of resume update page
     */
    const { getByLabelText } = render(
      <Ui updateResume={mockUpdateResume} {...props} />
    );

    /**
     * The user should see that description field of skill 0 is blank
     */
    const $description = getByLabelText(
      makeSkillFieldName(0, "description")
    ) as any;
    expect($description.value).toBe("");

    /**
     * When user fills the description field of skill 0
     */
    fillField($description, "desc");

    /**
     * And user blurs the field
     */

    fireEvent.blur($description);

    /**
     * Then the right data should be uploaded to the server
     */
    await wait(
      () => {
        const skillsArg = (mockUpdateResume.mock.calls[0][0] as any).variables
          .input.skills[0];

        expect(skillsArg.description).toBe("desc");
        expect(skillsArg.achievements[0]).toBeUndefined();
      },
      { interval: 1 }
    );

    /**
     * When user fills the achievement field
     */
    const $achievement = getByLabelText(achievementsLabelText(0, 0));
    fillField($achievement, "a");

    /**
     * And user blurs the achievement field
     */
    fireEvent.blur($achievement);

    /**
     * Then the correct data should be sent to the server
     */
    await wait(
      () => {
        const skillsArg = (mockUpdateResume.mock.calls[1][0] as any).variables
          .input.skills[0];

        expect(skillsArg.description).toBe("desc");
        expect(skillsArg.achievements[0]).toBe("a");
      },
      { interval: 1 }
    );
  });
});

describe("add/remove/swap skills", () => {
  let getByTestId: (
    text: Matcher,
    options?: MatcherOptions | undefined
  ) => HTMLElement;

  beforeEach(() => {
    mockUpdateResume = jest.fn();

    const props = {
      getResume: {
        skills: [
          { index: 1, description: "a" },
          { index: 2, description: "b" },
          { index: 3, description: "c" }
        ]
      },

      location
    } as Partial<Props>;

    const Ui = withFormik(formikConfig)(p => (
      <UpdateResumeFormP {...p} {...props} />
    )) as P;

    /**
     * Given that user is on skills section of resume update page
     */
    const args = render(<Ui updateResume={mockUpdateResume} {...props} />);

    getByTestId = args.getByTestId;
  });

  describe("adding skill", () => {
    test("from top", async () => {
      /**
       * When user clicks add button on skill 0
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.add, 0)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["a", "", "b", "c"]);
        },
        { interval: 1 }
      );
    });

    test("in the middle", async () => {
      /**
       * When user clicks add button on skill 1
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.add, 1)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["a", "b", "", "c"]);
        },
        { interval: 1 }
      );
    });

    test("to bottom", async () => {
      /**
       * When user clicks add button on skill 2
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.add, 2)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["a", "b", "c", ""]);
        },
        { interval: 1 }
      );
    });
  });

  describe("removing skills", () => {
    test("from top", async () => {
      /**
       * When user clicks remove button on skill 0
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 0)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["b", "c"]);
        },
        { interval: 1 }
      );
    });

    test("from middle", async () => {
      /**
       * When user clicks remove button on skill 1
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 1)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["a", "c"]);
        },
        { interval: 1 }
      );
    });

    test("from bottom", async () => {
      /**
       * When user clicks remove button on skill 2
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 2)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["a", "b"]);
        },
        { interval: 1 }
      );
    });
  });

  describe("swap", () => {
    test("up from middle", async () => {
      /**
       * When user clicks remove button on skill 1
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveUp, 1)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["b", "a", "c"]);
        },
        { interval: 1 }
      );
    });

    test("up from bottom", async () => {
      /**
       * When user clicks remove button on skill 2
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveUp, 2)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["a", "c", "b"]);
        },
        { interval: 1 }
      );
    });

    test("down from top", async () => {
      /**
       * When user clicks remove button on skill 0
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveDown, 0)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["b", "a", "c"]);
        },
        { interval: 1 }
      );
    });

    test("down from middle", async () => {
      /**
       * When user clicks remove button on skill 1
       */

      fireEvent.click(
        getByTestId(
          makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveDown, 1)
        )
      );

      /**
       * Then correct values should be sent to the server
       */
      await wait(
        () => {
          expect(
            getDescriptions(
              (mockUpdateResume.mock.calls[0][0] as any).variables.input.skills
            )
          ).toEqual(["a", "c", "b"]);
        },
        { interval: 1 }
      );
    });
  });
});

///////////////////////////////////////////////

function achievementsLabelText(skillIndex: number, achievementIndex: number) {
  return makeListStringHiddenLabelText(
    makeListStringFieldName(
      makeSkillFieldName(skillIndex, "achievements"),
      achievementIndex
    ),

    uiTexts.achievementsHiddenLabel
  );
}

function getDescriptions(skills: any) {
  return skills.map((s: any) => s.description);
}
