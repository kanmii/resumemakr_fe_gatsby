/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, fireEvent, wait, cleanup } from "@testing-library/react";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";
import { UpdateResumeForm } from "../components/UpdateResumeForm/update-resume.component";
import {
  Props,
  formikConfig,
  getInitialValues,
} from "../components/UpdateResumeForm/update-resume.utils";
import { fillField } from "./test_utils";
import { makeResumeRoute } from "../routing";
import { defaultVal } from "../components/PersonalInfo/personal-info.utils";
import {
  firstNameFieldId,
  lastNameFieldId,
  professionFieldId,
  phoneFieldId,
  addressFieldId,
  emailFieldId,
  dateOfBirthFieldId,
} from "../components/PersonalInfo/personal-info.dom-selectors";

jest.mock("../components/UpdateResumeForm/update-resume.injectables", () => ({
  debounceTime: 0,
}));

afterEach(() => {
  cleanup();
});

type P = React.ComponentType<Partial<Props>>;
const ResumeFormP = UpdateResumeForm as P;

/**
 * Mock out the Preview component
 */

jest.mock("../components/Preview", () => {
  return () => <div data-testid="preview-resume-section">1</div>;
});

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

    location,
  } as Partial<Props>;

  /**
   * Given user is on update resume page
   */
  const Ui = withFormik(formikConfig)(p => {
    return <ResumeFormP {...p} {...props} />;
  }) as P;

  render(<Ui />);

  /**
   * She should see that first name input is empty
   */

  const $firstName = document.getElementById(
    firstNameFieldId,
  ) as HTMLInputElement;

  expect($firstName.value).toBe("");

  /**
   * And that last name input is empty
   */
  const $lastName = document.getElementById(
    lastNameFieldId,
  ) as HTMLInputElement;

  expect($lastName.value).toBe("");

  /**
   * And that profession input is empty
   */
  const $profession = document.getElementById(
    professionFieldId,
  ) as HTMLInputElement;
  expect($profession.value).toBe("");

  /**
   * And that address input is empty
   */
  const $address = document.getElementById(addressFieldId) as HTMLInputElement;
  expect($address.value).toBe("");

  /**
   * And that phone input is empty
   */
  const $phone = document.getElementById(phoneFieldId) as HTMLInputElement;
  expect($phone.value).toBe("");

  /**
   * And that email input is empty
   */
  const $email = document.getElementById(emailFieldId) as HTMLInputElement;
  expect($email.value).toBe("");

  /**
   * And that date of birth input is empty
   */
  const $dateOfBirth = document.getElementById(
    dateOfBirthFieldId,
  ) as HTMLInputElement;
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
  await wait(() => {
    const args = mockUpdateResume.mock.calls[0][0].variables.input.personalInfo;

    expect([args.firstName, args.lastName]).toEqual([
      defaultVal.firstName,
      undefined,
    ]);
  });

  // -------------------------------------------------------------------

  /**
   * When user fills the last name input
   */
  fillField($lastName, defaultVal.lastName as string);

  fireEvent.blur($lastName);

  /**
   * Then the data should be sent to the server
   */

  await wait(() => {
    expect(
      mockUpdateResume.mock.calls[1][0].variables.input.personalInfo.lastName,
    ).toEqual(defaultVal.lastName);
  });
});
