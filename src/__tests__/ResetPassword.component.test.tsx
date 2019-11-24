/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ComponentType } from "react";
import { render, cleanup, fireEvent, wait } from "@testing-library/react";
import { ResetPassword } from "../components/ResetPassword/reset-password.component";
import {
  domEmailInputId,
  domPasswordInputId,
  domPasswordConfirmationInputId,
  domSubmitBtn,
  domSubmittingOverlay,
  domSubmitSuccess,
  domFormId,
} from "../components/ResetPassword/reset-password.dom-selectors";
import { Props } from "../components/ResetPassword/reset-password.utils";
import { fillField } from "./test_utils";
import {
  ResetPasswordSimpleMutationFnOptions,
  UseResetPasswordSimpleMutation,
} from "../graphql/apollo/reset-password.mutation";
import { ResetPasswordSimpleVariables } from "../graphql/apollo-types/ResetPasswordSimple";
import { act } from "react-dom/test-utils";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  cleanup();
});

it("renders with default email and submits successfully", async () => {
  const email = "a@b.com";
  const password = "123456";

  /**
   * Given that user email exists
   */

  const { ui, mockResetPassword, mockOnClose } = makeComp({
    props: { email },
  });

  /**
   * While using the component
   */
  const {} = render(ui);

  /**
   * Then email field should be pre-filled with user email
   */
  const domEmail = document.getElementById(domEmailInputId) as HTMLInputElement;
  expect(domEmail.value).toBe(email);

  /**
   * And submit button should be disabled
   */
  const domSubmit = document.getElementById(domSubmitBtn) as HTMLButtonElement;
  expect(domSubmit.disabled).toBe(true);

  /**
   * And form should not have success
   */

  const domForm = document.getElementById(domFormId) as HTMLFormElement;
  expect(domForm.classList).not.toContain("success");

  /**
   * When password is completed
   */
  const domPassword = document.getElementById(domPasswordInputId) as any;
  fillField(domPassword, password);
  fireEvent.blur(domPassword);

  /**
   * And password confirmation is completed
   */
  const domPasswordConfirmation = document.getElementById(
    domPasswordConfirmationInputId,
  ) as any;
  fillField(domPasswordConfirmation, password);
  fireEvent.blur(domPasswordConfirmation);

  /**
   * Then submit button should be enabled
   */
  expect(domSubmit.disabled).toBe(false);

  /**
   * And form should have success color
   */

  expect(domForm.classList).toContain("success");

  /**
   * And no overlay should be visible
   */
  expect(document.getElementById(domSubmittingOverlay)).toBeNull();

  /**
   * When form is submitted
   */
  domSubmit.click();

  /**
   * Then an overlay should be visible
   */
  expect(document.getElementById(domSubmittingOverlay)).not.toBeNull();

  /**
   * And no success UI should be visible
   */
  expect(document.getElementById(domSubmitSuccess)).toBeNull();

  await wait(() => true);

  /**
   * And correct data should be submitted
   */
  const mockResetPasswordCallArgs = mockResetPassword.mock
    .calls[0][0] as ResetPasswordSimpleMutationFnOptions;

  expect(
    (mockResetPasswordCallArgs.variables as ResetPasswordSimpleVariables).input,
  ).toEqual({
    email,
    password,
    passwordConfirmation: password,
  });

  /**
   * And overlay should become invisible
   */
  expect(document.getElementById(domSubmittingOverlay)).toBeNull();

  /**
   * And success UI should be visible
   */
  expect(document.getElementById(domSubmitSuccess)).not.toBeNull();

  /**
   * And submit button should be disabled
   */
  expect(domSubmit.disabled).toBe(true);

  /**
   * After a while, component should not be visible on the page
   */
  act(() => {
    jest.runAllTimers();

    expect(document.getElementById(
      domEmailInputId,
    ) as HTMLInputElement).toBeNull();
  });

  expect(mockOnClose).toHaveBeenCalled();
});

////////////////////////// HELPER FUNCTIONS ///////////////////////////

const ResetPasswordP = ResetPassword as ComponentType<Partial<Props>>;

function makeComp({ props = {} }: { props?: Partial<Props> } = {}) {
  const mockResetPassword = jest.fn();
  const mockOnClose = jest.fn();

  return {
    ui: (
      <ResetPasswordP
        useResetPasswordSimple={
          ([mockResetPassword] as unknown) as UseResetPasswordSimpleMutation
        }
        onClose={mockOnClose}
        {...props}
      />
    ),
    mockResetPassword,
    mockOnClose,
  };
}
