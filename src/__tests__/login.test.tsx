// tslint:disable:no-any
import React from "react";
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  act
} from "react-testing-library";

import { Login } from "../components/Login/component";
import { Props } from "../components/Login/utils";
import { fillField } from "./test_utils";
import { LoginMutation_login_user } from "../graphql/apollo/types/LoginMutation";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

jest.mock("../utils/refresh-to-my-resumes");
jest.mock("../State/get-conn-status");
jest.mock("../components/Header", () => ({
  Header: jest.fn(() => null)
}));

import { refreshToMyResumes } from "../utils/refresh-to-my-resumes";
import { getConnStatus } from "../State/get-conn-status";

const mockRefreshToMyResumes = refreshToMyResumes as jest.Mock;
const mockGetConnStatus = getConnStatus as jest.Mock;

const LoginP = Login as React.FunctionComponent<Partial<Props>>;
const passwortMuster = new RegExp("Password");

it("renders correctly and submits", async () => {
  /**
   * Given that server will return logged in user after submission
   */
  const user = {} as LoginMutation_login_user;

  const { ui, mockUpdateLocalUser, mockLogin } = makeComp();

  mockLogin.mockResolvedValue({
    data: {
      login: { user }
    }
  });

  /**
   * While using component
   */
  const { getByText, getByLabelText } = render(ui);

  /**
   * Then the submit button should be disabled
   */
  const $button = getByText(/Submit/);
  expect($button).toBeDisabled();

  /**
   * When we complete the form
   */
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");

  /**
   * Then the submit button should be enabled
   */
  expect($button).not.toBeDisabled();

  /**
   * When we submit the form
   */
  fireEvent.click($button);

  /**
   * Then correct data should be uploaded to the server and user should be
   * saved locally to client
   */
  await wait(
    () => {
      expect(mockUpdateLocalUser).toBeCalledWith({ variables: { user } });
    },
    {
      interval: 1
    }
  );

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

  const { getByText, getByLabelText, getByTestId, queryByTestId } = render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(queryByTestId("login-form-error")).not.toBeInTheDocument();

  /**
   * When we complete the form with invalid email and submit
   */
  fillField(getByLabelText("Email"), "invalid email");
  fillField(getByLabelText(passwortMuster), "awesome pass");

  act(() => {
    fireEvent.click(getByText(/Submit/));
  });

  /**
   * Then we should see error Ui
   */
  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/email/i));

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

  const { getByText, getByLabelText, getByTestId, queryByTestId } = render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(queryByTestId("login-form-error")).not.toBeInTheDocument();

  /**
   * When we complete the form with invalid password and submit
   */
  fillField(getByLabelText("Email"), "awesome@email.com");
  fillField(getByLabelText(passwortMuster), "12");

  act(() => {
    fireEvent.click(getByText(/Submit/));
  });

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/too short/i));

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
      graphQLErrors: [new GraphQLError("Invalid email/password")]
    })
  );

  /**
   * While we are using the component
   */
  const { getByText, getByLabelText, getByTestId, queryByTestId } = render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(queryByTestId("login-form-error")).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillForm(getByLabelText, getByText);

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/Invalid email\/password/i));

  /**
   * And we should not be redirected
   */
  expect(mockRefreshToMyResumes).not.toBeCalled();
});

it("logs out user if logged in", done => {
  /**
   * Given that we are logged in
   */
  const { ui, mockUpdateLocalUser } = makeComp({
    props: { userLocal: { user: {} } as any }
  });

  /**
   * While using the component
   */
  render(ui);

  /**
   * Then we should be logged out
   */
  setTimeout(() => {
    expect(mockUpdateLocalUser).toBeCalledWith({
      variables: {
        user: null
      }
    });
  });

  done();
});

it("does not log out user if user not logged in", async () => {
  /**
   * Given that we are not logged in
   */
  const { ui, mockUpdateLocalUser } = makeComp({
    props: { userLocal: { user: null } as any }
  });

  /**
   * While using the component
   */
  const {} = render(ui);

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
  const { getByText, getByLabelText, queryByText } = render(ui);

  /**
   * Then we should not see error UI
   */
  expect(queryByText(/You are not connected/)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillForm(getByLabelText, getByText);

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => getByText(/You are not connected/));
  expect($error).toBeInTheDocument();
});

it("renders error if server did not return a valid user", async () => {
  /**
   * Given that server will return an invalid user
   */
  const { ui, mockLogin } = makeComp();

  mockLogin.mockResolvedValue({
    data: {
      login: { user: null }
    }
  });

  /**
   * While using the component
   */
  const { getByText, getByLabelText, queryByText } = render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(
    queryByText(/There is a problem logging you in/)
  ).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillForm(getByLabelText, getByText);

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() =>
    getByText(/There is a problem logging you in/)
  );

  expect($error).toBeInTheDocument();
});

function fillForm(getByLabelText: any, getByText: any) {
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");
  fireEvent.click(getByText(/Submit/));
}

function makeComp({
  isConnected = true,
  props = {}
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
    mockLogin
  };
}
