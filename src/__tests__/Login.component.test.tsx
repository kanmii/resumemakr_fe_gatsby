/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cleanup, render, wait, waitForElement } from "@testing-library/react";
import { Login } from "../components/Login/login.component";
import { Props } from "../components/Login/login.utils";
import { fillField } from "./test_utils";
import { LoginMutation_login_user } from "../graphql/apollo-types/LoginMutation";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";
import { refreshToMyResumes } from "../utils/refresh-to-my-resumes";
import { isConnected } from "../state/get-conn-status";
import {
  domSubmitBtnId,
  domEmailInputId,
  domPasswordInputId,
  domFormErrorId,
} from "../components/Login/login.dom-selectors";
import { useUserLocalMutation } from "../state/user.local.mutation";
import { getUser } from "../state/tokens";
import { useLoggedOutUserMutation } from "../state/logged-out-user.local.query";
import { useLoginMutation } from "../graphql/apollo/login.mutation";
import { domResetPasswordTriggerId } from "../components/PasswordInput/password-input.dom-selectors";
import {
  PASSWORD_TOO_SHORT_ERROR_MESSAGE,
  IS_INVALID_ERROR_MESSAGE,
} from "../components/components.utils";

jest.mock("../utils/refresh-to-my-resumes");
jest.mock("../state/get-conn-status");
jest.mock("../components/Header/header.index.ts", () => ({
  Header: jest.fn(() => null),
}));
jest.mock("../state/user.local.mutation");
jest.mock("../state/tokens");
jest.mock("../state/logged-out-user.local.query");
jest.mock("../graphql/apollo/login.mutation");

const mockResetPasswordId = "mock-reset-password";

jest.mock("../components/ResetPassword/reset-password.component", () => ({
  ResetPassword: (props: any) => (
    <div id={mockResetPasswordId} onClick={props.onClose} />
  ),
}));

const mockRefreshToMyResumes = refreshToMyResumes as jest.Mock;
const mockGetConnStatus = isConnected as jest.Mock;
const mockUseLocalUserMutation = useUserLocalMutation as jest.Mock;
const mockGetUser = getUser as jest.Mock;
const mockUseLoggedOutUserMutation = useLoggedOutUserMutation as jest.Mock;
const mockUseLoginMutation = useLoginMutation as jest.Mock;

beforeEach(() => {
  mockUseLocalUserMutation.mockReset();
  mockRefreshToMyResumes.mockReset();
  mockGetConnStatus.mockReset();
  mockGetUser.mockReset();
  mockUseLoggedOutUserMutation.mockReset();
  mockUseLoginMutation.mockReset();
  jest.useFakeTimers();
});

afterEach(() => {
  cleanup();
  jest.runAllTimers();
  jest.clearAllTimers();
});

it("renders correctly and submits", async () => {
  /**
   * Given that server will return logged in user after submission
   */
  const user = {} as LoginMutation_login_user;

  const { ui, mockUpdateLocalUser, mockLogin } = makeComp();

  mockLogin.mockResolvedValue({
    data: {
      login: { user },
    },
  });

  /**
   * While using component
   */
  render(ui);

  /**
   * Then the submit button should be disabled
   */
  const $button = document.getElementById(domSubmitBtnId) as HTMLButtonElement;
  expect($button.disabled).toBe(true);

  /**
   * When we complete the form
   */
  fillField(
    document.getElementById(domEmailInputId) as HTMLElement,
    "me@me.com",
  );

  fillField(
    document.getElementById(domPasswordInputId) as HTMLElement,
    "awesome pass",
  );
  /**
   * Then the submit button should be enabled
   */
  expect($button.disabled).toBe(false);

  /**
   * When we submit the form
   */
  $button.click();

  /**
   * Then correct data should be uploaded to the server and user should be
   * saved locally to client
   */
  await wait(() => {
    expect(mockUpdateLocalUser).toBeCalledWith({ variables: { user } });
  });

  /**
   * And we should be redirected
   */
  expect(mockRefreshToMyResumes).toBeCalled();
});

it("renders error if email is invalid", async () => {
  /**
   * Given we are using the component
   */
  const { ui } = makeComp();

  render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(document.getElementById(domFormErrorId)).toBeNull();

  /**
   * When we complete the form with invalid email and submit
   */
  fillField(
    document.getElementById(domEmailInputId) as HTMLElement,
    "invalid email",
  );

  fillField(
    document.getElementById(domPasswordInputId) as HTMLElement,
    "awesome pass",
  );

  (document.getElementById(domSubmitBtnId) as HTMLElement).click();

  /**
   * Then we should see error Ui
   */
  const $error = await waitForElement(() => {
    return document.getElementById(domFormErrorId) as HTMLElement;
  });

  expect($error.textContent).toContain(IS_INVALID_ERROR_MESSAGE);

  /**
   * And we should not be redirected
   */
  expect(mockRefreshToMyResumes).not.toBeCalled();
});

it("renders error if password is invalid", async () => {
  /**
   * Given that we are using the component
   */
  const { ui } = makeComp();

  render(ui);

  /*s
   * Then we should not see any error UI
   */
  expect(document.getElementById(domFormErrorId)).toBeNull();

  /**
   * When we complete the form with invalid password and submit
   */
  fillField(
    document.getElementById(domEmailInputId) as HTMLElement,
    "awesome@email.com",
  );

  fillField(document.getElementById(domPasswordInputId) as HTMLElement, "12");

  (document.getElementById(domSubmitBtnId) as HTMLButtonElement).click();

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => {
    return document.getElementById(domFormErrorId) as HTMLElement;
  });

  expect($error.textContent).toContain(PASSWORD_TOO_SHORT_ERROR_MESSAGE);

  /**
   * And we should not be redirected
   */
  expect(refreshToMyResumes).not.toBeCalled();
});

it("renders error if server returns error", async () => {
  /**
   * Given that submission to server will fail
   */
  const { ui, mockLogin } = makeComp();

  mockLogin.mockRejectedValue(
    new ApolloError({
      graphQLErrors: [new GraphQLError("lolo")],
    }),
  );

  /**
   * While we are using the component
   */
  render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(document.getElementById(domFormErrorId)).toBeNull();

  /**
   * When we complete and submit the form
   */
  fillForm();

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => {
    return document.getElementById(domFormErrorId) as HTMLElement;
  });

  expect($error.textContent).toContain("lolo");

  /**
   * And we should not be redirected
   */
  expect(mockRefreshToMyResumes).not.toBeCalled();
});

it("logs out user if logged in", () => {
  /**
   * Given that we are logged in
   */
  mockGetUser.mockReturnValue({});
  const { ui, mockUpdateLocalUser } = makeComp();

  /**
   * While using the component
   */
  render(ui);
  jest.runAllTimers();

  /**
   * Then we should be logged out
   */
  expect(mockUpdateLocalUser).toBeCalledWith({
    variables: {
      user: null,
    },
  });
});

it("does not log out user if user not logged in", async () => {
  /**
   * Given that we are not logged in
   */
  mockGetUser.mockReturnValue(null);
  const { ui, mockUpdateLocalUser } = makeComp();

  /**
   * While using the component
   */
  const {} = render(ui);
  jest.runAllTimers();

  /**
   * Then we should not be logged out
   */
  expect(mockUpdateLocalUser).not.toBeCalled();
});

it("renders error if no connection", async () => {
  /**
   * Given that we are not connected to server
   */
  const { ui } = makeComp({ isConnected: false });

  /**
   * While using the component
   */
  render(ui);

  /**
   * Then we should not see error UI
   */
  expect(document.getElementById(domFormErrorId)).toBeNull();

  /**
   * When we complete and submit the form
   */
  fillForm();

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => {
    return document.getElementById(domFormErrorId) as HTMLElement;
  });

  expect($error.textContent).toContain("conn");
});

it("renders error if server did not return a valid user", async () => {
  /**
   * Given that server will return an invalid user
   */
  const { ui, mockLogin } = makeComp();

  mockLogin.mockResolvedValue({
    data: {
      login: { user: null },
    },
  });

  /**
   * While using the component
   */
  render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(document.getElementById(domFormErrorId) as HTMLElement).toBeNull();

  /**
   * When we complete and submit the form
   */
  fillForm();

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => {
    return document.getElementById(domFormErrorId) as HTMLElement;
  });

  expect($error.textContent).toContain("prob");
});

it("opens and closes resetpassword UI", () => {
  const { ui } = makeComp();

  /**
   * Given we are interracting with the component
   */
  render(ui);

  /**
   * Then we should not see UI to reset password
   */
  expect(document.getElementById(mockResetPasswordId)).toBeNull();

  /**
   * When password field is completed
   */
  const domPassword = document.getElementById(
    domPasswordInputId,
  ) as HTMLInputElement;

  const password = "123456";
  fillField(domPassword, password);

  /**
   * Then masked password should be visible
   */

  expect(domPassword.value).toBe(password);

  /**
   * When UI to trigger password reset Ui is clicked
   */
  (document.getElementById(domResetPasswordTriggerId) as HTMLElement).click();

  /**
   * Then we should see UI to reset password
   */
  const resetPasswordUI = document.getElementById(
    mockResetPasswordId,
  ) as HTMLElement;
  expect(resetPasswordUI).not.toBeNull();

  /**
   * When password reset ui is closed
   */

  resetPasswordUI.click();

  /**
   * Then password reset UI should no longer be visible
   */
  expect(document.getElementById(mockResetPasswordId)).toBeNull();

  /**
   * Then masked password should no longer be visible
   */

  expect(domPassword.value).toBe("");
});

////////////////////////// HELPER ////////////////////////////

const LoginP = Login as React.FunctionComponent<Partial<Props>>;

function fillForm() {
  fillField(
    document.getElementById(domEmailInputId) as HTMLElement,
    "me@me.com",
  );

  fillField(
    document.getElementById(domPasswordInputId) as HTMLElement,
    "awesome pass",
  );

  (document.getElementById(domSubmitBtnId) as HTMLButtonElement).click();
}

function makeComp({
  isConnected = true,
}: { isConnected?: boolean; props?: Partial<Props> } = {}) {
  mockGetConnStatus.mockResolvedValue(isConnected);

  const mockLogin = jest.fn();
  const mockUpdateLocalUser = jest.fn();
  mockUseLocalUserMutation.mockReturnValue([mockUpdateLocalUser]);
  mockUseLoginMutation.mockReturnValue([mockLogin]);
  mockUseLoggedOutUserMutation.mockReturnValue({});

  return {
    ui: <LoginP />,

    mockUpdateLocalUser,
    mockLogin,
  };
}
