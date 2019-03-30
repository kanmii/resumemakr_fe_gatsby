import React from "react";
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  act
} from "react-testing-library";

import { SignUp } from "../components/SignUp/sign-up-x";
import {
  Props,
  passworteNichtGleich,
  uiTexts
} from "../components/SignUp/sign-up";
import { LOGIN_URL } from "../routing";

import { fillField, WithData, renderWithApollo } from "./test_utils";

const SignUpP = SignUp as React.FunctionComponent<Partial<Props>>;
const passwortMuster = new RegExp("Password");
const passBestMuster = new RegExp("Password Confirmation");
const submitBtnPattern = new RegExp(uiTexts.submitBtn, "i");

import {
  UserRegMutation,
  UserRegMutation_registration_user
} from "../graphql/apollo/types/UserRegMutation";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

it("renders correctly and submits", async () => {
  const user = {} as UserRegMutation_registration_user;
  const registration = { user };
  const result = {
    data: {
      registration
    }
  } as WithData<UserRegMutation>;

  const mockRegUser = makeRegUserFunc(result);
  const mockUpdateLocalUser = jest.fn();
  const nachgemachtemAktualisierenZuHause = jest.fn();

  const { ui } = makeComp({
    regUser: mockRegUser,
    updateLocalUser: mockUpdateLocalUser,
    getConn: jest.fn(() => true),
    refreshToHome: nachgemachtemAktualisierenZuHause
  });

  const { container, getByText, getByLabelText } = render(ui);

  const $signUp = container.firstChild as HTMLDivElement;
  expect($signUp).toContainElement(getByText(/Sign up to create your resume/));
  expect($signUp).toContainElement(
    getByText(/Already have an account\? Login/)
  );

  const $button = getByText(submitBtnPattern);
  expect($button.getAttribute("name")).toBe("sign-up-submit");
  expect($button).toBeDisabled();

  const $source = getByLabelText("Source");
  expect($source.getAttribute("value")).toBe("password");
  expect($source).toHaveAttribute("readonly");
  const $sourceParent = $source.closest(".form-field") as HTMLDivElement;
  expect($sourceParent.classList).toContain("disabled");

  const $name = getByLabelText("Name");
  expect($name).toBe(document.activeElement);

  const $email = getByLabelText("Email");
  expect($email.getAttribute("type")).toBe("email");

  const $pwd = getByLabelText(passwortMuster);
  expect($pwd.getAttribute("type")).toBe("password");

  const $pwdConfirm = getByLabelText(passBestMuster);
  expect($pwdConfirm.getAttribute("type")).toBe("password");

  fillField($name, "Kanmii");
  fillField($email, "me@me.com");
  fillField($pwd, "awesome pass");
  fillField($pwdConfirm, "awesome pass");
  expect($button).not.toHaveAttribute("disabled");

  act(() => {
    fireEvent.click($button);
  });

  await wait(() =>
    expect(mockUpdateLocalUser).toHaveBeenCalledWith({ variables: { user } })
  );

  expect(nachgemachtemAktualisierenZuHause).toBeCalled();
});

it("renders error if regUser function is null", async () => {
  const { ui, mockScrollToTop } = makeComp({ regUser: undefined });
  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() => getByTestId("sign-up-form-error"));
  expect($error).toContainElement(getByText(/Unknown error/));
  expect(mockScrollToTop).toBeCalled();
});

it("renders error if password and password confirm are not same", async () => {
  const { ui, mockScrollToTop } = makeComp({ regUser: makeRegUserFunc() });
  const { getByText, getByLabelText, getByTestId } = render(ui);

  fillField(getByLabelText("Name"), "Kanmii");
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");
  fillField(getByLabelText(passBestMuster), "awesome pass1");

  act(() => {
    fireEvent.click(getByText(submitBtnPattern));
  });

  const $error = await waitForElement(() => getByTestId("sign-up-form-error"));
  expect($error).toContainElement(getByText(new RegExp(passworteNichtGleich)));
  expect(mockScrollToTop).toBeCalled();
});

it("renders error if server returns error", async () => {
  const mockRegUser = jest.fn(() =>
    Promise.reject(
      new ApolloError({
        graphQLErrors: [
          new GraphQLError(
            JSON.stringify({
              errors: { email: "email" }
            })
          )
        ]
      })
    )
  );

  const { ui, mockScrollToTop } = makeComp({
    regUser: mockRegUser,
    updateLocalUser: jest.fn(),
    getConn: jest.fn(() => true)
  });

  const { getByText, getByLabelText, getByTestId } = render(ui);
  fillForm(getByLabelText, getByText);

  const $error = await waitForElement(() =>
    getByTestId(uiTexts.formErrorTestId)
  );
  expect($error).toContainElement(getByText(/email/i));
  expect(mockScrollToTop).toBeCalled();
});

it("redirects to login", () => {
  const { ui, mockNavigate } = makeComp();
  const { getByText } = render(ui);

  act(() => {
    fireEvent.click(getByText(/Already have an account\? Login/));
  });

  expect(mockNavigate).toBeCalledWith(LOGIN_URL);
});

it("renders error if nicht verbinden", async () => {
  const { ui, mockScrollToTop } = makeComp({
    regUser: jest.fn(),
    getConn: jest.fn(() => false)
  });

  const { getByText, getByLabelText, queryByText } = render(ui);
  expect(queryByText(/You are not connected/)).not.toBeInTheDocument();

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() => getByText(/You are not connected/));
  expect($error).toBeInTheDocument();
  expect(mockScrollToTop).toBeCalled();
});

it("renders error if user von Server ist falsch", async () => {
  const { ui, mockScrollToTop } = makeComp({
    regUser: jest.fn(() =>
      Promise.resolve({
        data: {
          registration: { user: null }
        }
      })
    ),
    getConn: jest.fn(() => true)
  });

  const { getByText, getByLabelText, queryByText } = render(ui);
  expect(queryByText(/Account creation has failed/)).not.toBeInTheDocument();

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() =>
    getByText(/Account creation has failed/)
  );
  expect($error).toBeInTheDocument();
  expect(mockScrollToTop).toBeCalled();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:no-any
function makeRegUserFunc(data?: any) {
  if (data) {
    return jest.fn(() => Promise.resolve(data));
  }

  return jest.fn();
}

// tslint:disable-next-line:no-any
function fillForm(getByLabelText: any, getByText: any) {
  fillField(getByLabelText("Name"), "Kanmii");
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");
  fillField(getByLabelText(passBestMuster), "awesome pass");

  act(() => {
    fireEvent.click(getByText(submitBtnPattern));
  });
}

function makeComp(params: Props | {} = {}) {
  const mockScrollToTop = jest.fn();
  const mockNavigate = jest.fn();

  const { Ui, ...rest } = renderWithApollo(SignUpP);

  return {
    ...rest,
    ui: (
      <Ui scrollToTop={mockScrollToTop} navigate={mockNavigate} {...params} />
    ),
    mockScrollToTop,
    mockNavigate
  };
}
