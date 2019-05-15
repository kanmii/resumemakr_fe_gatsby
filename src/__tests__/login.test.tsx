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
import { fillField, renderWithApollo } from "./test_utils";
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
  const user = {} as LoginMutation_login_user;
  const login = { user };

  const { ui, mockUpdateLocalUser, mockLogin } = makeComp();

  mockLogin.mockResolvedValue({
    data: {
      login
    }
  });

  const { getByText, getByLabelText } = render(ui);

  const $button = getByText(/Submit/);
  expect($button).toBeDisabled();

  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");
  expect($button).not.toBeDisabled();
  fireEvent.click($button);

  await wait(
    () => {
      expect(mockUpdateLocalUser).toBeCalledWith({ variables: { user } });
    },
    {
      interval: 1
    }
  );

  expect(mockRefreshToMyResumes).toBeCalled();
});

it("renders error if email is invalid", async () => {
  const { ui } = makeComp();

  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillField(getByLabelText("Email"), "invalid email");
  fillField(getByLabelText(passwortMuster), "awesome pass");

  act(() => {
    fireEvent.click(getByText(/Submit/));
  });

  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/email/i));
});

it("renders error if password is invalid", async () => {
  const { ui } = makeComp();

  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillField(getByLabelText("Email"), "awesome@email.com");
  fillField(getByLabelText(passwortMuster), "12");

  act(() => {
    fireEvent.click(getByText(/Submit/));
  });

  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/too short/i));
});

it("renders error if server returns error", async () => {
  const { ui, mockLogin } = makeComp();

  mockLogin.mockRejectedValue(
    new ApolloError({
      graphQLErrors: [new GraphQLError("Invalid email/password")]
    })
  );

  const { getByText, getByLabelText, getByTestId } = render(ui);
  fillForm(getByLabelText, getByText);

  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/Invalid email\/password/i));
});

it("logs out user if logged in", done => {
  const { ui, mockUpdateLocalUser } = makeComp(true, {
    userLocal: { user: {} }
  });

  render(ui);

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
  const { ui, mockUpdateLocalUser } = makeComp(false, {
    userLocal: { user: null }
  });

  const {} = render(ui);
  expect(mockUpdateLocalUser).not.toBeCalled();
});

it("renders error if no connection", async () => {
  const { ui } = makeComp(false);

  const { getByText, getByLabelText, queryByText } = render(ui);

  expect(queryByText(/You are not connected/)).not.toBeInTheDocument();

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() => getByText(/You are not connected/));
  expect($error).toBeInTheDocument();
});

it("renders error if server did not return a valid user", async () => {
  const { ui, mockLogin } = makeComp();

  mockLogin.mockResolvedValue({
    data: {
      login: { user: null }
    }
  });

  const { getByText, getByLabelText, queryByText } = render(ui);

  expect(
    queryByText(/There is a problem logging you in/)
  ).not.toBeInTheDocument();

  fillForm(getByLabelText, getByText);

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

function makeComp(
  isConnected: boolean = true,
  params: Partial<Props> | {} = {}
) {
  mockGetConnStatus.mockReset();
  mockGetConnStatus.mockResolvedValue(isConnected);

  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();
  const mockUpdateLocalUser = jest.fn();

  const { Ui, ...rest1 } = renderWithApollo(LoginP);

  return {
    ...rest1,
    ui: (
      <Ui
        navigate={mockNavigate}
        login={mockLogin}
        updateLocalUser={mockUpdateLocalUser}
        {...params}
      />
    ),
    mockNavigate,
    mockUpdateLocalUser,
    mockLogin
  };
}
