// tslint:disable: no-any
import React from "react";
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  act
} from "react-testing-library";

import { SignUp } from "../components/SignUp/component";
import {
  Props,
  passworteNichtGleich,
  uiTexts
} from "../components/SignUp/utils";

import { fillField, WithData, renderWithApollo } from "./test_utils";

jest.mock("../utils/refresh-to-my-resumes");
jest.mock("../State/get-conn-status");
jest.mock("../components/SignUp/scroll-to-top");

import { refreshToMyResumes } from "../utils/refresh-to-my-resumes";
import { getConnStatus } from "../State/get-conn-status";
import { scrollToTop } from "../components/SignUp/scroll-to-top";

const mockRefreshToMyResumes = refreshToMyResumes as jest.Mock;
const mockGetConnStatus = getConnStatus as jest.Mock;
const mockScrollToTop = scrollToTop as jest.Mock;

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

it("renders error if password and password confirm are not same", async () => {
  const { ui } = makeComp();
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
  const { ui, mockRegUser } = makeComp();

  mockRegUser.mockRejectedValue(
    new ApolloError({
      graphQLErrors: [
        new GraphQLError(
          JSON.stringify({
            errors: { email: "email" }
          })
        )
      ]
    })
  );

  const { getByText, getByLabelText, getByTestId } = render(ui);
  fillForm(getByLabelText, getByText);

  const $error = await waitForElement(() =>
    getByTestId(uiTexts.formErrorTestId)
  );
  expect($error).toContainElement(getByText(/email/i));
  expect(mockScrollToTop).toBeCalled();
});

it("renders error if nicht verbinden", async () => {
  const { ui } = makeComp({}, false);

  const { getByText, getByLabelText, queryByText } = render(ui);
  expect(queryByText(/You are not connected/)).not.toBeInTheDocument();

  fillForm(getByLabelText, getByText);
  const $error = await waitForElement(() => getByText(/You are not connected/));
  expect($error).toBeInTheDocument();
  expect(mockScrollToTop).toBeCalled();
});

it("renders error if user von Server ist falsch", async () => {
  const { ui, mockRegUser } = makeComp();

  mockRegUser.mockResolvedValue({
    data: {
      registration: { user: null }
    }
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

it("renders correctly and submits", async () => {
  const user = {} as UserRegMutation_registration_user;
  const registration = { user };
  const result = {
    data: {
      registration
    }
  } as WithData<UserRegMutation>;

  const { ui, mockRegUser, mockUpdateLocalUser } = makeComp();

  mockRegUser.mockResolvedValue(result);

  const { container, getByText, getByLabelText } = render(ui);

  const $signUp = container.firstChild as HTMLDivElement;
  expect($signUp).toContainElement(getByText(/Sign up to create your resume/));
  expect($signUp).toContainElement(
    getByText(/Already have an account\? Login/)
  );

  const $button = getByText(submitBtnPattern) as any;
  expect($button.name).toBe("sign-up-submit");
  expect($button).toBeDisabled();

  const $source = getByLabelText("Source") as any;
  expect($source.value).toBe("password");
  expect($source).toHaveAttribute("readonly");
  const $sourceParent = $source.closest(".form-field") as any;
  expect($sourceParent.classList).toContain("disabled");

  const $name = getByLabelText("Name");
  expect($name).toBe(document.activeElement);

  const $email = getByLabelText("Email") as any;
  expect($email.type).toBe("email");

  const $pwd = getByLabelText(passwortMuster) as any;
  expect($pwd.type).toBe("password");

  const $pwdConfirm = getByLabelText(passBestMuster) as any;
  expect($pwdConfirm.type).toBe("password");

  fillField($name, "Kanmii");
  fillField($email, "me@me.com");
  fillField($pwd, "awesome pass");
  fillField($pwdConfirm, "awesome pass");
  expect($button).not.toHaveAttribute("disabled");

  act(() => {
    fireEvent.click($button);
  });

  await wait(
    () => {
      expect(mockUpdateLocalUser.mock.calls[0][0].variables.user).toEqual(user);
    },
    { interval: 1 }
  );

  expect(mockRefreshToMyResumes).toBeCalled();
  expect(mockScrollToTop).not.toHaveBeenCalled();
});

function fillForm(getByLabelText: any, getByText: any) {
  fillField(getByLabelText("Name"), "Kanmii");
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");
  fillField(getByLabelText(passBestMuster), "awesome pass");

  act(() => {
    fireEvent.click(getByText(submitBtnPattern));
  });
}

function makeComp(params: Props | {} = {}, isConnected: boolean = true) {
  mockGetConnStatus.mockReset();
  mockGetConnStatus.mockResolvedValue(isConnected);

  mockScrollToTop.mockReset();

  const mockNavigate = jest.fn();
  const mockRegUser = jest.fn();
  const mockUpdateLocalUser = jest.fn();

  const { Ui, ...rest } = renderWithApollo(SignUpP);

  return {
    ...rest,
    ui: (
      <Ui
        navigate={mockNavigate}
        regUser={mockRegUser}
        updateLocalUser={mockUpdateLocalUser}
        {...params}
      />
    ),

    mockNavigate,
    mockRegUser,
    mockUpdateLocalUser
  };
}
