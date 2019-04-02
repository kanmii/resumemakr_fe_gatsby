import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent } from "react-testing-library";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";

import { ResumeForm } from "../components/ResumeForm/resume-form-x";
import {
  Props,
  initialFormValues,
  formikConfig
} from "../components/ResumeForm/resume-form";
import { renderWithApollo } from "./test_utils";
import { GetResume_getResume } from "../graphql/apollo/types/GetResume";

type P = React.ComponentClass<Partial<Props>>;
const ResumeFormP = ResumeForm as P;

/**
 * Mock out the Preview component
 */

jest.mock("../components/Preview", () => {
  return () => <div data-testid="preview-resume-section">1</div>;
});

xit("navigates forward", () => {
  /**
   * Given she is on the resume makr page
   */
  const { Ui: ui } = renderWithApollo(ResumeFormP);
  const Ui = withFormik(formikConfig)(ui) as P;

  const { getByTestId, queryByTestId, getByText, queryByText } = render(
    <Ui
      getResume={initialFormValues as GetResume_getResume}
      values={initialFormValues}
      location={{ hash: "" } as WindowLocation}
    />
  );

  /**
   * She sees that personal info section is loaded on the page
   */
  expect(getByTestId("personal-info-section")).toBeInTheDocument();

  /**
   * And that education section is not loaded on the page
   */
  expect(queryByTestId("experiences-section")).not.toBeInTheDocument();

  /**
   * And that 'go to previous section' button is not present on the page
   */
  expect(queryByText(/Previous resume section/)).not.toBeInTheDocument();

  /**
   * And that next button is present on page
   */
  expect(getByText(/Next resume section experiences/i)).toBeInTheDocument();

  /**
   * And that preview resume section is not present on the page
   */
  expect(queryByTestId("preview-resume-section")).not.toBeInTheDocument();

  /**
   * When she clicks on 'preview unfinished resume' button
   */
  const $preview = getByText(/Partial\: preview your resume/i);
  fireEvent.click($preview);

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
  expect(queryByText(/Partial\: preview your resume/i)).not.toBeInTheDocument();

  /**
   * And that next button is gone from the page
   */
  expect(
    queryByText(/Next resume section experiences/i)
  ).not.toBeInTheDocument();

  /**
   * When she clicks on 'back to editor' button
   */
  const $toEditor = getByText(/Back to Editor/);
  fireEvent.click($toEditor);

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
  let $next = getByText(/Next resume section experiences/i);
  fireEvent.click($next);

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

  expect(
    getByText(/Previous resume section personal information/i)
  ).toBeInTheDocument();

  /**
   * And that additional skills section has not been loaded
   */
  expect(queryByTestId("additional-skills-section")).not.toBeInTheDocument();

  /**
   * And the next button when hovered points to education section
   */
  $next = getByText(/Next resume section education/i);

  /**
   * When she clicks on next button
   */
  fireEvent.click($next);

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
  expect(
    queryByText(/Previous resume section personal information/i)
  ).not.toBeInTheDocument();

  /**
   * And that the previous button now points to experiences section
   */
  expect(getByText(/Previous resume section experiences/i)).toBeInTheDocument();

  /**
   * And that next button points to additional skills section
   */

  $next = getByText(/Next resume section additional skills/i);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

  /**
   * She sees that education section is gone from page
   */
  expect(queryByTestId("education-section")).not.toBeInTheDocument();

  /**
   * And that additional skills section is now loaded unto the page
   */

  expect(getByTestId("additional-skills-section")).toBeInTheDocument();

  /**
   * And that the previous button no longer points experiences sections
   */
  expect(
    queryByText(/Previous resume section experiences/i)
  ).not.toBeInTheDocument();

  /**
   * And that the previous button now points to education section
   */
  expect(getByText(/Previous resume section education/i)).toBeInTheDocument();

  /**
   * And that next button points to languages section
   */

  $next = getByText(/Next resume section languages/i);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

  /**
   * She sees that additional skills section is gone from page
   */
  expect(queryByTestId("additional-skills-section")).not.toBeInTheDocument();

  /**
   * And that languages section is now loaded unto the page
   */

  expect(getByTestId("languages-section")).toBeInTheDocument();

  /**
   * And that the previous button no longer points education sections
   */
  expect(
    queryByText(/Previous resume section education/i)
  ).not.toBeInTheDocument();

  /**
   * And that the previous button now points to additional skills section
   */
  expect(
    getByText(/Previous resume section additional skills/i)
  ).toBeInTheDocument();

  // ----------------------------------------------------------
  /**
   * And that next button points to hobbies section
   */

  $next = getByText(/Next resume section hobbies/i);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

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
  expect(
    queryByText(/Previous resume section additional skills/i)
  ).not.toBeInTheDocument();

  /**
   * And that the previous button now points to languages section
   */
  expect(getByText(/Previous resume section languages/i)).toBeInTheDocument();

  // ----------------------------------------------------------
  /**
   * And that next button points to skills section
   */

  $next = getByText(/Next resume section skills/i);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

  /**
   * She sees that hobbies section is gone from page
   */
  expect(queryByTestId("hobbies-section")).not.toBeInTheDocument();

  /**
   * And that skills section is now loaded unto the page
   */

  expect(getByTestId("skills-section")).toBeInTheDocument();

  /**
   * And that the previous button no longer points languages sections
   */
  expect(
    queryByText(/Previous resume section languages/i)
  ).not.toBeInTheDocument();

  /**
   * And that the previous button now points to hobbies section
   */
  expect(getByText(/Previous resume section hobbies/i)).toBeInTheDocument();

  /**
   * And that preview unfinished resume button is no longer
   * present on the page
   */
  expect(queryByText(/Partial\: preview your resume/i)).not.toBeInTheDocument();

  /**
   * And that next button points to preview resume section, signalling end
   * of navigation
   */
  expect(getByText(/End\: preview your resume/i)).toBeInTheDocument();
});
