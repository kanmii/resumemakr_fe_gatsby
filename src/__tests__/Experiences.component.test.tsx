/* eslint-disable @typescript-eslint/no-explicit-any */
import "jest-dom/extend-expect";
import React from "react";
import "jest-dom/extend-expect";
import { render, fireEvent, wait, cleanup } from "react-testing-library";
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
import {
  uiTexts,
  makeExperienceFieldName,
} from "../components/Experiences/experiences.utils";
import {
  ListDisplayCtrlNames,
  makeListDisplayCtrlTestId,
} from "../components/components";
import {
  makeListStringFieldName,
  makeListStringHiddenLabelText,
} from "../components/ListStrings/list-strings.index";

/**
 * Mock out the Preview component
 */

jest.mock("../components/Preview", () => {
  return () => <div data-testid="preview-resume-section">1</div>;
});

jest.mock("../components/UpdateResumeForm/update-resume.injectables", () => ({
  debounceTime: 0,
}));

afterEach(() => {
  cleanup();
});

const fieldName = "experiences";

describe("Experiences achievements", () => {
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

  const achievementsPrefixFieldName = makeExperienceFieldName(
    0,
    "achievements",
  );

  const achievement0FieldName = makeListStringFieldName(
    achievementsPrefixFieldName,
    0,
  );

  const achievement1FieldName = makeListStringFieldName(
    achievementsPrefixFieldName,
    1,
  );

  const achievement1Label = makeListStringHiddenLabelText(
    achievement1FieldName,
    uiTexts.achievementsLabels2,
  );

  it("adds achievement", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId, getByLabelText } = render(ui);
    /**
     * When user clicks on achievement 0 add button
     */
    const $achievement0CtrlAddBtn = getByTestId(
      makeListDisplayCtrlTestId(
        achievement0FieldName,
        ListDisplayCtrlNames.add,
      ),
    );

    fireEvent.click($achievement0CtrlAddBtn);

    /**
     * Then user should see a newly added empty text box under achievement 0
     */
    const $achievement1 = getByLabelText(achievement1Label) as any;

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

  it("removes achievement", async done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId } = render(ui);

    /**
     * When user clicks on achievement 1 remove button
     */
    const $achievement1CtrlRemoveBtn = getByTestId(
      makeListDisplayCtrlTestId(
        achievement1FieldName,
        ListDisplayCtrlNames.remove,
      ),
    );

    fireEvent.click($achievement1CtrlRemoveBtn);

    /**
     * Then correct data should be sent to the server
     */

    await wait(() => {
      expect(
        mockUpdateResume.mock.calls[0][0].variables.input.experiences[0]
          .achievements,
      ).toEqual(["a0", "a2"]);
    });

    done();
  });

  it("swaps achievements up", async () => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId } = render(ui);

    /**
     * When user clicks on 'move up' button of achievement 1
     */
    const $achievement1CtrlUpBtn = getByTestId(
      makeListDisplayCtrlTestId(
        achievement1FieldName,
        ListDisplayCtrlNames.moveUp,
      ),
    );

    fireEvent.click($achievement1CtrlUpBtn);

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

    const { getByTestId } = render(ui);

    /**
     * When user clicks on 'move down' button of achievement 1
     */
    const $achievement1CtrlDownBtn = getByTestId(
      makeListDisplayCtrlTestId(
        achievement1FieldName,
        ListDisplayCtrlNames.moveDown,
      ),
    );

    fireEvent.click($achievement1CtrlDownBtn);

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
});

describe("Experiences - add/remove/swap", () => {
  const initial = {
    experiences: [
      { companyName: "c0", index: 1 },
      { companyName: "c1", index: 2 },
      { companyName: "c2", index: 3 },
    ],
  } as GetResume_getResume;

  const company2LabelText = makeExperienceFieldName(2, "companyName");

  it("adds experience in middle", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId, getByLabelText } = render(ui);
    /**
     * Given that a user sees company 2 at position 2
     */

    expect((getByLabelText(company2LabelText) as any).value).toEqual("c2");

    /**
     * When user clicks on add button of experience 1
     */
    const experience1AddCtrlBtnId = makeListDisplayCtrlTestId(
      fieldName,
      ListDisplayCtrlNames.add,
      1,
    );

    fireEvent.click(getByTestId(experience1AddCtrlBtnId));

    /**
     * Then an empty company should be rendered at position 2
     */
    expect((getByLabelText(company2LabelText) as any).value).toEqual("");

    /**
     * And correct values should be uploaded to server
     */

    setTimeout(() => {
      expect(
        mockUpdateResume.mock.calls[0][0].variables.input.experiences.map(
          (e: any) => e.companyName,
        ),
      ).toEqual(["c0", "c1", "", "c2"]);
    });

    done();
  });

  it("adds experience to the end", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { queryByLabelText, getByTestId, getByLabelText } = render(ui);

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
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.add, 2),
      ),
    );

    /**
     * Then user should see an empty input box at position 3
     */
    expect((getByLabelText(company3LabelText) as any).value).toBe("");

    /**
     * And correct data should be uploaded to the server
     */

    setTimeout(() => {
      expect(
        mockUpdateResume.mock.calls[0][0].variables.input.experiences.map(
          (e: any) => e.companyName,
        ),
      ).toEqual(["c0", "c1", "c2", ""]);
    });

    done();
  });

  it("removes first experience", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId } = render(ui);

    /**
     * When user clicks on remove button of experience 0
     */

    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 0),
      ),
    );

    /**
     * Then correct values should be uploaded to server
     */

    setTimeout(() => {
      expect(
        getCompanyNames(
          mockUpdateResume.mock.calls[0][0].variables.input.experiences,
        ),
      ).toEqual(["c1", "c2"]);
    });

    done();
  });

  it("removes last experience", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByLabelText, getByTestId, queryByLabelText } = render(ui);

    /**
     * Given that user sees company 2 in the document
     */

    expect(getByLabelText(company2LabelText)).toBeInTheDocument();

    /**
     * When user clicks on remove button of experience 2
     */

    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 2),
      ),
    );

    /**
     * Then company 2 should no longer be in the document
     */
    expect(queryByLabelText(company2LabelText)).not.toBeInTheDocument();

    /**
     * And values should be uploaded to server
     */

    setTimeout(() => {
      expect(
        getCompanyNames(
          mockUpdateResume.mock.calls[0][0].variables.input.experiences,
        ),
      ).toEqual(["c0", "c1"]);
    });

    done();
  });

  it("removes experience from the middle", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId } = render(ui);

    /**
     * When user clicks on remove button of experience 1
     */

    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.remove, 1),
      ),
    );

    /**
     * Then correct values should be uploaded to server
     */
    setTimeout(() => {
      expect(
        getCompanyNames(
          mockUpdateResume.mock.calls[0][0].variables.input.experiences,
        ),
      ).toEqual(["c0", "c2"]);
    });

    done();
  });

  it("moves experience up from middle", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId } = render(ui);

    /**
     * When user clicks on move up button of experience 1
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveUp, 1),
      ),
    );

    /**
     * Then the right values should have been sent to the server
     */
    setTimeout(() => {
      expect(
        getCompanyNames(
          mockUpdateResume.mock.calls[0][0].variables.input.experiences,
        ),
      ).toEqual(["c1", "c0", "c2"]);
    });

    done();
  });

  it("moves last experience up", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId } = render(ui);

    /**
     * When user clicks on experience 2 move up button
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveUp, 2),
      ),
    );

    /**
     * Then correct data should be uploaded to the server
     */

    setTimeout(() => {
      expect(
        getCompanyNames(
          mockUpdateResume.mock.calls[0][0].variables.input.experiences,
        ),
      ).toEqual(["c0", "c2", "c1"]);
    });

    done();
  });

  it("moves experience down from the middle", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId } = render(ui);

    /**
     * When user clicks move down button on experience 1
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveDown, 1),
      ),
    );
    /**
     * Then the correct data should be uploaded to the server
     */

    setTimeout(() => {
      expect(
        getCompanyNames(
          mockUpdateResume.mock.calls[0][0].variables.input.experiences,
        ),
      ).toEqual(["c0", "c2", "c1"]);
    });

    done();
  });

  it("moves first experience down", done => {
    const { ui, mockUpdateResume } = makeComp({
      getResume: initial,
    });

    const { getByTestId } = render(ui);

    /**
     * When user clicks the move down button on experience at position 0
     */
    fireEvent.click(
      getByTestId(
        makeListDisplayCtrlTestId(fieldName, ListDisplayCtrlNames.moveDown, 0),
      ),
    );

    /**
     * Then the correct data should be uploaded to the server
     */

    setTimeout(() => {
      expect(
        getCompanyNames(
          mockUpdateResume.mock.calls[0][0].variables.input.experiences,
        ),
      ).toEqual(["c1", "c0", "c2"]);
    });

    done();
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

function getCompanyNames(experiences: any) {
  return experiences.map((e: any) => e.companyName);
}
