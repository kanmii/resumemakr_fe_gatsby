/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cleanup, render, wait, waitForElement } from "@testing-library/react";
import { Login } from "../components/Login/login.component";
import { Props } from "../components/Login/login.utils";
import { fillField } from "./test_utils";
import { LoginMutation_login_user } from "../graphql/apollo/types/LoginMutation";
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

jest.mock("../utils/refresh-to-my-resumes");
jest.mock("../state/get-conn-status");
jest.mock("../components/Header", () => ({
  Header: jest.fn(() => null),
}));

const mockRefreshToMyResumes = refreshToMyResumes as jest.Mock;
const mockGetConnStatus = isConnected as jest.Mock;

const LoginP = Login as React.FunctionComponent<Partial<Props>>;

beforeEach(() => {
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

  expect($error.textContent).toContain("email");

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

  expect($error.textContent).toContain("short");

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
  const { ui, mockUpdateLocalUser } = makeComp({
    props: { userLocal: { user: {} } as any },
  });

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
  const { ui, mockUpdateLocalUser } = makeComp({
    props: { userLocal: { user: null } as any },
  });

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
  props = {},
}: { isConnected?: boolean; props?: Partial<Props> } = {}) {
  mockRefreshToMyResumes.mockReset();

  mockGetConnStatus.mockReset();
  mockGetConnStatus.mockResolvedValue(isConnected);

  const mockLogin = jest.fn();
  const mockUpdateLocalUser = jest.fn();

  return {
    ui: (
      <LoginP
        login={mockLogin}
        updateLocalUser={mockUpdateLocalUser}
        {...props}
      />
    ),

    mockUpdateLocalUser,
    mockLogin,
  };
}
