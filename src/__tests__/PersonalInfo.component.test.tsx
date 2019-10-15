/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait } from "react-testing-library";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";
import { UpdateResumeForm } from "../components/UpdateResumeForm/update-resume.component";
import {
  Props,
  formikConfig,
  getInitialValues,
} from "../components/UpdateResumeForm/update-resume.utils";
import { renderWithApollo, fillField } from "./test_utils";
import { makeResumeRoute } from "../routing";
import {
  uiTexts,
  defaultVal,
} from "../components/PersonalInfo/personal-info.utils";

type P = React.ComponentType<Partial<Props>>;
const ResumeFormP = UpdateResumeForm as P;
const debounceTime = 0;

/**
 * Mock out the Preview component
 */

jest.mock("../components/Preview", () => {
  return () => <div data-testid="preview-resume-section">1</div>;
});

describe("Personal info", () => {
  it("updates on input blur", async () => {
    const location = {
      hash: "",
      pathname: makeResumeRoute("first resume", ""),
    } as WindowLocation;

    const initial = getInitialValues(null);

    const mockUpdateResume = jest.fn();

    const props = {
      getResume: initial,

      updateResume: mockUpdateResume,

      debounceTime,

      location,
    } as Partial<Props>;

    /**
     * Given user is on update resume page
     */
    const { Ui: ui } = renderWithApollo(ResumeFormP, props);
    const Ui = withFormik(formikConfig)(ui) as P;

    const { getByLabelText } = render(<Ui {...props} />);

    /**
     * She should see that first name input is empty
     */

    const $firstName = getByLabelText(uiTexts.firstNameLabel) as any;
    expect($firstName.value).toBe("");

    /**
     * And that last name input is empty
     */
    const $lastName = getByLabelText(uiTexts.lastNameLabel) as any;
    expect($lastName.value).toBe("");

    /**
     * And that profession input is empty
     */
    const $profession = getByLabelText(uiTexts.professionLabel) as any;
    expect($profession.value).toBe("");

    /**
     * And that address input is empty
     */
    const $address = getByLabelText(uiTexts.addressLabel) as any;
    expect($address.value).toBe("");

    /**
     * And that phone input is empty
     */
    const $phone = getByLabelText(uiTexts.phoneLabel) as any;
    expect($phone.value).toBe("");

    /**
     * And that email input is empty
     */
    const $email = getByLabelText(uiTexts.emailLabel) as any;
    expect($email.value).toBe("");

    /**
     * And that date of birth input is empty
     */
    const $dateOfBirth = getByLabelText(uiTexts.dateOfBirthLabel) as any;
    expect($dateOfBirth.value).toBe("");

    // -------------------------------------------------------------------

    /**
     * When user fills the first name input
     */
    fillField($firstName, defaultVal.firstName as string);

    fireEvent.blur($firstName);

    /**
     * Then the data should be sent to the server
     */
    await wait(
      () => {
        const args =
          mockUpdateResume.mock.calls[0][0].variables.input.personalInfo;

        expect([args.firstName, args.lastName]).toEqual([
          defaultVal.firstName,
          undefined,
        ]);
      },
      {
        interval: 1,
      },
    );

    // -------------------------------------------------------------------

    /**
     * When user fills the last name input
     */
    fillField($lastName, defaultVal.lastName as string);

    fireEvent.blur($lastName);

    /**
     * Then the data should be sent to the server
     */

    await wait(
      () => {
        expect(
          mockUpdateResume.mock.calls[1][0].variables.input.personalInfo
            .lastName,
        ).toEqual(defaultVal.lastName);
      },
      {
        interval: 1,
      },
    );
  });
});
