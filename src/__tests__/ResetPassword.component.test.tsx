/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ComponentType } from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
} from "@testing-library/react";
import { ResetPassword } from "../components/ResetPassword/reset-password.component";
import {
  domEmailInputId,
  domPasswordInputId,
  domPasswordConfirmationInputId,
  domSubmitBtnId,
  domSubmittingOverlayId,
  domSubmitSuccessId,
  domEmailErrorId,
  domPasswordConfirmationErrorId,
  domPasswordErrorId,
  domSubmitServerErrorsId,
  domPrefix,
} from "../components/ResetPassword/reset-password.dom-selectors";
import { Props } from "../components/ResetPassword/reset-password.utils";
import { fillField, closeMessage } from "./test_utils";
import {
  ResetPasswordSimpleMutationFnOptions,
  UseResetPasswordSimpleMutation,
} from "../graphql/apollo/reset-password.mutation";
import { ResetPasswordSimpleVariables } from "../graphql/apollo-types/ResetPasswordSimple";
import { act } from "react-dom/test-utils";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

const mockLoadingComponentId = "mock-loading";
jest.mock("../components/Loading/loading.component", () => ({
  Loading: () => <div id={mockLoadingComponentId} />,
}));

describe("ui", () => {
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
    const domEmail = document.getElementById(
      domEmailInputId,
    ) as HTMLInputElement;
    expect(domEmail.value).toBe(email);

    /**
     * And submit button should be disabled
     */
    const domSubmit = document.getElementById(
      domSubmitBtnId,
    ) as HTMLButtonElement;
    expect(domSubmit.disabled).toBe(true);

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
     * And no overlay should be visible
     */
    expect(document.getElementById(domSubmittingOverlayId)).toBeNull();

    /**
     * And loading UI should not be visible
     */

    expect(document.getElementById(mockLoadingComponentId)).toBeNull();

    /**
     * When form is submitted
     */
    domSubmit.click();

    /**
     * Then an overlay should be visible
     */
    expect(document.getElementById(domSubmittingOverlayId)).not.toBeNull();

    /**
     * And no success UI should be visible
     */
    expect(document.getElementById(domSubmitSuccessId)).toBeNull();

    /**
     * And loading UI should be visible
     */

    expect(document.getElementById(mockLoadingComponentId)).not.toBeNull();

    /**
     * And success UI should be visible
     */
    const domSuccessUi = await waitForElement(() =>
      document.getElementById(domSubmitSuccessId),
    );

    expect(domSuccessUi).not.toBeNull();

    /**
     * And correct data should be submitted
     */
    const mockResetPasswordCallArgs = mockResetPassword.mock
      .calls[0][0] as ResetPasswordSimpleMutationFnOptions;

    expect(
      (mockResetPasswordCallArgs.variables as ResetPasswordSimpleVariables)
        .input,
    ).toEqual({
      email,
      password,
      passwordConfirmation: password,
    });

    /**
     * And overlay should not be visible
     */
    expect(document.getElementById(domSubmittingOverlayId)).toBeNull();

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

  it("renders form and graphQLErrors errors", async () => {
    /**
     * Given that server will reject request
     */
    const { ui, mockResetPassword } = makeComp();

    mockResetPassword.mockRejectedValue(
      new ApolloError({
        graphQLErrors: [new GraphQLError("error")],
      }),
    );

    /**
     * When we use component
     */
    render(ui);
    const domEmail = document.getElementById(
      domEmailInputId,
    ) as HTMLInputElement;
    const domPassword = document.getElementById(
      domPasswordInputId,
    ) as HTMLInputElement;
    const domPasswordConfirmation = document.getElementById(
      domPasswordConfirmationInputId,
    ) as HTMLInputElement;

    /**
     * Then we should not see form field errors
     */
    expect(document.getElementById(domEmailErrorId)).toBeNull();
    expect(document.getElementById(domPasswordErrorId)).toBeNull();
    expect(document.getElementById(domPasswordConfirmationErrorId)).toBeNull();

    /**
     * And we complete form fields with invalid data
     */
    fillField(domEmail, "aa");
    fireEvent.blur(domEmail);

    fillField(domPassword, "aa");
    fireEvent.blur(domPassword);

    fillField(domPasswordConfirmation, "aa");
    fireEvent.blur(domPasswordConfirmation);

    /**
     * Then we should see form fields error messages
     */
    expect(document.getElementById(domEmailErrorId)).not.toBeNull();
    expect(document.getElementById(domPasswordErrorId)).not.toBeNull();
    expect(
      document.getElementById(domPasswordConfirmationErrorId),
    ).not.toBeNull();

    /**
     * When form fields are filled with valid data
     */

    fillField(domEmail, "a@b.com");
    fireEvent.blur(domEmail);

    fillField(domPassword, "12345");
    fireEvent.blur(domPassword);

    fillField(domPasswordConfirmation, "12345");
    fireEvent.blur(domPasswordConfirmation);

    /**
     * Then form field errors should not be visible
     */
    expect(document.getElementById(domEmailErrorId)).toBeNull();
    expect(document.getElementById(domPasswordErrorId)).toBeNull();
    expect(document.getElementById(domPasswordConfirmationErrorId)).toBeNull();

    /**
     * However when password confirmation field is completed with data that differs
     * from password field
     */
    fillField(domPasswordConfirmation, "12346");
    fireEvent.blur(domPasswordConfirmation);

    /**
     * Then password confirmation error should be visible
     */
    expect(
      document.getElementById(domPasswordConfirmationErrorId),
    ).not.toBeNull();

    /**
     * When all fields have been correctly completed
     */
    fillField(domPasswordConfirmation, "12345");
    fireEvent.blur(domPasswordConfirmation);

    /**
     * Then we should not see submission error UI
     */
    expect(document.getElementById(domSubmitServerErrorsId)).toBeNull();

    /**
     * When form is submitted
     */
    (document.getElementById(domSubmitBtnId) as HTMLElement).click();

    /**
     * Then submission error UI should be visible
     */
    const domErrorUi = await waitForElement(() =>
      document.getElementById(domSubmitServerErrorsId),
    );
    expect(domErrorUi).not.toBeNull();
  });

  it("renders network error", async () => {
    /**
     * Given that server will reject request
     */
    const { ui, mockResetPassword } = makeComp();

    mockResetPassword.mockRejectedValue(
      new ApolloError({
        networkError: new Error("error"),
      }),
    );

    /**
     * When we use component
     */
    render(ui);
    const domEmail = document.getElementById(
      domEmailInputId,
    ) as HTMLInputElement;
    const domPassword = document.getElementById(
      domPasswordInputId,
    ) as HTMLInputElement;
    const domPasswordConfirmation = document.getElementById(
      domPasswordConfirmationInputId,
    ) as HTMLInputElement;

    /**
     * When all fields have been correctly completed
     */
    fillField(domEmail, "a@b.com");
    fireEvent.blur(domEmail);

    fillField(domPassword, "12345");
    fireEvent.blur(domPassword);

    fillField(domPasswordConfirmation, "12345");
    fireEvent.blur(domPasswordConfirmation);

    /**
     * Then we should not see submission error UI
     */
    expect(document.getElementById(domSubmitServerErrorsId)).toBeNull();

    /**
     * When form is submitted
     */
    (document.getElementById(domSubmitBtnId) as HTMLElement).click();

    /**
     * Then submission error UI should be visible
     */
    const domErrorUi = await waitForElement(() =>
      document.getElementById(domSubmitServerErrorsId),
    );
    expect(domErrorUi).not.toBeNull();
  });

  it("closes component", () => {
    /**
     * Given we are using the component
     */
    const { ui, mockOnClose } = makeComp();
    render(ui);

    /**
     * Then we should see the component
     */
    const domModal = document.getElementById(domPrefix) as HTMLElement;
    expect(domModal).not.toBeNull();

    /**
     * When component is closed
     */
    closeMessage(domModal);

    /**
     * Then component should not be visible
     */
    expect(document.getElementById(domPrefix)).toBeNull();
    expect(mockOnClose).toHaveBeenCalled();
  });
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
