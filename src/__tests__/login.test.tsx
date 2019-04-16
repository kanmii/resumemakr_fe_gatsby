import React from "react";
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  act
} from "react-testing-library";

import { Login } from "../components/Login/login-x";
import { Props } from "../components/Login/login";
import { fillField, WithData, renderWithApollo } from "./test_utils";
import {
  LoginMutation,
  LoginMutation_login_user
} from "../graphql/apollo/types/LoginMutation";
import { UserFragment } from "../graphql/apollo/types/UserFragment";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

const LoginP = Login as React.FunctionComponent<Partial<Props>>;
const passwortMuster = new RegExp("Password");

it("renders correctly and submits", async () => {
  const user = {} as LoginMutation_login_user;
  const login = { user };
  const result = {
    data: {
      login
    }
  } as WithData<LoginMutation>;

  const mockLogin = makeLoginFunc(result);
  const mockUpdateLocalUser = jest.fn();
  const nachgemachtemAktualisierenZuHause = jest.fn();

  const { ui } = makeComp({
    login: mockLogin,
    updateLocalUser: mockUpdateLocalUser,
    getConn: jest.fn(() => Promise.resolve(true)),
    refreshToHome: nachgemachtemAktualisierenZuHause
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

  expect(nachgemachtemAktualisierenZuHause).toBeCalled();
});

it("renders error if login function is null", async () => {
  const { ui } = makeComp({
    login: undefined
  });

  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/Unknown error/));
});

it("renders error if email is invalid", async () => {
  const { ui } = makeComp({
    login: makeLoginFunc()
  });

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
  const { ui } = makeComp({
    login: makeLoginFunc()
  });

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
  const mockLogin = jest.fn(() =>
    Promise.reject(
      new ApolloError({
        graphQLErrors: [new GraphQLError("Invalid email/password")]
      })
    )
  );

  const { ui } = makeComp({
    login: mockLogin,
    updateLocalUser: jest.fn(),
    getConn: jest.fn(() => Promise.resolve(true))
  });

  const { getByText, getByLabelText, getByTestId } = render(ui);
  fillForm(getByLabelText, getByText);

  const $error = await waitForElement(() => getByTestId("login-form-error"));
  expect($error).toContainElement(getByText(/Invalid email\/password/i));
});

it("logs out user if logged in", done => {
  const mockUpdateLocalUser = jest.fn();
  const user = {} as UserFragment;

  const { ui } = makeComp({
    updateLocalUser: mockUpdateLocalUser,
    userLocal: { user }
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
  const mockUpdateLocalUser = jest.fn();
  const user = null;

  const { ui } = makeComp({
    updateLocalUser: mockUpdateLocalUser,
    userLocal: { user }
  });

  const {} = render(ui);
  expect(mockUpdateLocalUser).not.toBeCalled();
});

it("renders error if no connection", async () => {
  const { ui } = makeComp({
    getConn: jest.fn(() => Promise.resolve(false)),
    login: jest.fn()
  });

  const { getByText, getByLabelText, queryByText } = render(ui);

  expect(queryByText(/You are not connected/)).not.toBeInTheDocument();

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() => getByText(/You are not connected/));
  expect($error).toBeInTheDocument();
});

it("renders error if server did not return a valid user", async () => {
  const result = {
    data: {
      login: { user: null }
    }
  } as WithData<LoginMutation>;

  const { ui } = makeComp({
    getConn: jest.fn(() => Promise.resolve(true)),
    login: makeLoginFunc(result)
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:no-any
function makeLoginFunc(data?: any) {
  if (data) {
    return jest.fn(() => Promise.resolve(data));
  }

  return jest.fn();
}

// tslint:disable-next-line:no-any
function fillForm(getByLabelText: any, getByText: any) {
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");
  fireEvent.click(getByText(/Submit/));
}

function makeComp(params: Partial<Props> | {} = {}) {
  const mockPush = jest.fn();
  const mockNavigate = jest.fn();

  const { Ui, ...rest1 } = renderWithApollo(LoginP);

  return {
    ...rest1,
    ui: <Ui navigate={mockNavigate} {...params} />,
    mockPush,
    mockNavigate
  };
}
