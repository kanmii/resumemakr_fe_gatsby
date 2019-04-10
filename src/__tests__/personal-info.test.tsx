import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, wait } from "react-testing-library";
import { withFormik } from "formik";
import { WindowLocation } from "@reach/router";
import update from "immutability-helper";
import { ResumeForm } from "../components/ResumeForm/resume-form-x";
import {
  Props,
  formikConfig,
  getInitialValues
} from "../components/ResumeForm/resume-form";
import { renderWithApollo, fillField } from "./test_utils";
import { makeResumeRoute } from "../routing";
import {
  uiTexts as personalInfoUiTexts,
  defaultVal as personalInfoDefaultVal
} from "../components/PersonalInfo/personal-info";
import { UpdateResumeVariables } from "../graphql/apollo/types/UpdateResume";
import { GetResume_getResume } from "../graphql/apollo/types/GetResume";

type P = React.ComponentType<Partial<Props>>;
const ResumeFormP = ResumeForm as P;
const debounceTime = 0;

/**
 * Mock out the Preview component
 */

jest.mock("../components/Preview", () => {
  return () => <div data-testid="preview-resume-section">1</div>;
});

describe("Personal info", () => {
  it("updates input blur", async () => {
    const location = {
      hash: "",
      pathname: makeResumeRoute("first resume", "")
    } as WindowLocation;

    const initial = getInitialValues(null);

    const mockUpdateResume = jest.fn();

    const props = {
      getResume: initial,

      updateResume: mockUpdateResume,

      debounceTime,

      location
    } as Partial<Props>;

    /**
     * Given user is on update resume page
     */
    const { Ui: ui } = renderWithApollo(ResumeFormP, props);
    const Ui = withFormik(formikConfig)(ui) as P;

    const { /* debug, */ getByLabelText } = render(<Ui {...props} />);

    /**
     * She should see that first name input is empty
     */
    const $firstName = getByLabelText(personalInfoUiTexts.firstNameLabel);
    expect($firstName.getAttribute("value")).toBe("");

    /**
     * And that last name input is empty
     */
    const $lastName = getByLabelText(personalInfoUiTexts.lastNameLabel);
    expect($lastName.getAttribute("value")).toBe("");

    /**
     * And that profession input is empty
     */
    const $profession = getByLabelText(personalInfoUiTexts.professionLabel);
    expect($profession.getAttribute("value")).toBe("");

    /**
     * And that address input is empty
     */
    const $address = getByLabelText(personalInfoUiTexts.addressLabel);
    expect($address.textContent).toBe(""); // textarea!!!!!!

    /**
     * And that phone input is empty
     */
    const $phone = getByLabelText(personalInfoUiTexts.phoneLabel);
    expect($phone.getAttribute("value")).toBe("");

    /**
     * And that email input is empty
     */
    const $email = getByLabelText(personalInfoUiTexts.emailLabel);
    expect($email.getAttribute("value")).toBe("");

    /**
     * And that date of birth input is empty
     */
    const $dateOfBirth = getByLabelText(personalInfoUiTexts.dateOfBirthLabel);
    expect($dateOfBirth.getAttribute("value")).toBe("");

    // -------------------------------------------------------------------

    /**
     * When user fills the first name input
     */
    fillField($firstName, personalInfoDefaultVal.firstName as string);

    fireEvent.blur($firstName);

    /**
     * Then the data should be sent to the server
     */
    const initial0 = {
      ...initial,
      personalInfo: { firstName: personalInfoDefaultVal.firstName }
    } as GetResume_getResume;

    await wait(() => {
      expect(mockUpdateResume.mock.calls[0][0]).toMatchObject({
        variables: {
          input: initial0
        } as UpdateResumeVariables
      });
    });

    // -------------------------------------------------------------------

    /**
     * When user fills the last name input
     */
    fillField($lastName, personalInfoDefaultVal.lastName as string);

    fireEvent.blur($lastName);

    /**
     * Then the data should be sent to the server
     */
    const initial1 = update(initial0, {
      personalInfo: {
        lastName: {
          $set: personalInfoDefaultVal.lastName as string
        }
      }
    });

    await wait(() => {
      expect(mockUpdateResume.mock.calls[1][0]).toMatchObject({
        variables: {
          input: initial1
        } as UpdateResumeVariables
      });
    });
  });
});
