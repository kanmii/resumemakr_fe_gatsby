/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentType } from "react";
import { render, fireEvent, wait, cleanup } from "@testing-library/react";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";
import {
  UpdateResumeForm,
  makeUrlHashSegment,
} from "../components/UpdateResumeForm/update-resume.component";
import { emptyVal } from "../components/Skills/skills.utils";
import {
  Props,
  formikConfig,
  Section,
} from "../components/UpdateResumeForm/update-resume.utils";
import { ResumePathHash, makeResumeRoute } from "../routing";
import { makeInputId } from "../components/ListStrings/list-strings.dom-selectors";
import { fillField } from "./test_utils";
import {
  makeDescriptionInputId,
  makeAchievementId,
} from "../components/Skills/skills.dom-selectors";
import { useUpdateResumeMutation } from "../graphql/apollo/update-resume.mutation";

jest.mock("../graphql/apollo/update-resume.mutation");
const mockUseUpdateResumeMutation = useUpdateResumeMutation as jest.Mock;

beforeEach(() => {
  mockUseUpdateResumeMutation.mockReset();
});

afterEach(() => {
  cleanup();
});

type P = ComponentType<Partial<Props>>;
const UpdateResumeFormP = UpdateResumeForm as P;
const location = {
  hash: makeUrlHashSegment(ResumePathHash.edit, Section.skills),
  pathname: makeResumeRoute("title"),
} as WindowLocation;

it("updates server on input blur", async () => {
  const mockUpdateResume = jest.fn();
  mockUseUpdateResumeMutation.mockReturnValue([mockUpdateResume]);

  const props = {
    getResume: {
      skills: [emptyVal],
    },
    location,
  } as Partial<Props>;

  const Ui = withFormik(formikConfig)(p => (
    <UpdateResumeFormP {...p} {...props} />
  )) as P;

  /**
   * Given that user is on skills section of resume update page
   */
  render(<Ui {...props} />);

  /**
   * The user should see that description field of skill 0 is blank
   */
  const $description = document.getElementById(
    makeDescriptionInputId(0),
  ) as HTMLInputElement;

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
  await wait(() => {
    const skillsArg = (mockUpdateResume.mock.calls[0][0] as any).variables.input
      .skills[0];

    expect(skillsArg.description).toBe("desc");
    expect(skillsArg.achievements[0]).toBeUndefined();
  });

  /**
   * When user fills the achievement field
   */
  const $achievement = document.getElementById(
    makeInputId(makeAchievementId(0)),
  ) as HTMLInputElement;

  fillField($achievement, "a");

  /**
   * And user blurs the achievement field
   */
  fireEvent.blur($achievement);

  /**
   * Then the correct data should be sent to the server
   */
  await wait(() => {
    const skillsArg = (mockUpdateResume.mock.calls[1][0] as any).variables.input
      .skills[0];

    expect(skillsArg.description).toBe("desc");
    expect(skillsArg.achievements[0]).toBe("a");
  });
});
