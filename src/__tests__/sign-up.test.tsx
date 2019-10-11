/* eslint-disable @typescript-eslint/no-explicit-any */
import "jest-dom/extend-expect";
import React from "react";
import { render, fireEvent, wait, waitForElement } from "react-testing-library";
import { SignUp } from "../components/SignUp/component";
import {
  Props,
  passworteNichtGleich,
  uiTexts
} from "../components/SignUp/utils";
import { fillField } from "./test_utils";
import { refreshToMyResumes } from "../utils/refresh-to-my-resumes";
import { isConnected } from "../state/get-conn-status";
import { scrollToTop } from "../components/SignUp/scroll-to-top";

jest.mock("../utils/refresh-to-my-resumes");
jest.mock("../state/get-conn-status");
jest.mock("../components/SignUp/scroll-to-top");

const mockRefreshToMyResumes = refreshToMyResumes as jest.Mock;
const mockGetConnStatus = isConnected as jest.Mock;
const mockScrollToTop = scrollToTop as jest.Mock;

const passwortMuster = new RegExp("Password");
const passBestMuster = new RegExp("Password Confirmation");
const submitBtnPattern = new RegExp(uiTexts.submitBtn, "i");

import { UserRegMutation_registration_user } from "../graphql/apollo/types/UserRegMutation";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

it("renders error if password and password confirm are not same", async () => {
  /**
   * Given we are using the component
   */
  const { ui } = makeComp();
  const { getByText, getByLabelText, getByTestId, queryByTestId } = render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(queryByTestId("sign-up-form-error")).not.toBeInTheDocument();

  /**
   * When we complete the form with different password and password
   * confirmation and submit the form
   */
  fillField(getByLabelText("Name"), "Kanmii");
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");
  fillField(getByLabelText(passBestMuster), "awesome pass1");
  fireEvent.click(getByText(submitBtnPattern));

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => getByTestId("sign-up-form-error"));
  expect($error).toContainElement(getByText(new RegExp(passworteNichtGleich)));

  /**
   * And page should be automatically scrolled to the top
   */
  expect(mockScrollToTop).toBeCalled();

  /**
   * And we should not be redirected
   */
  expect(mockRefreshToMyResumes).not.toBeCalled();
});

it("renders error if server returns error", async () => {
  /**
   * Given that server will return error
   */
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

  /**
   * When we interact the component
   */
  const { getByText, getByLabelText, getByTestId, queryByTestId } = render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(queryByTestId(uiTexts.formErrorTestId)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() =>
    getByTestId(uiTexts.formErrorTestId)
  );
  expect($error).toContainElement(getByText(/email/i));

  /**
   * And page should be automatically scrolled to the top
   */
  expect(mockScrollToTop).toBeCalled();

  /**
   * When we close the error UI
   */
  fireEvent.click($error.querySelector(".icon.close") as any);

  /**
   * Then we should no longer see any error UI
   */
  expect(queryByTestId(uiTexts.formErrorTestId)).not.toBeInTheDocument();
});

it("renders error if nicht verbinden", async () => {
  /**
   * Given that server is not connected
   */
  const { ui } = makeComp({ isConnected: false });

  /**
   * When we interact the component
   */
  const { getByText, getByLabelText, queryByText } = render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(queryByText(/You are not connected/)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => getByText(/You are not connected/));
  expect($error).toBeInTheDocument();

  /**
   * And page should be automatically scrolled to the top
   */
  expect(mockScrollToTop).toBeCalled();
});

it("renders error if user von Server ist falsch", async () => {
  /**
   * Given that server will return invalid user on form submission
   */
  const { ui, mockRegUser } = makeComp();

  mockRegUser.mockResolvedValue({
    data: {
      registration: { user: null }
    }
  });

  /**
   * When we interact with the component
   */
  const { getByText, getByLabelText, queryByText } = render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(queryByText(/Account creation has failed/)).not.toBeInTheDocument();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm(getByLabelText, getByText);

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() =>
    getByText(/Account creation has failed/)
  );
  expect($error).toBeInTheDocument();

  /**
   * And page should be automatically scrolled to the top
   */
  expect(mockScrollToTop).toBeCalled();
});

it("renders correctly and submits", async () => {
  /**
   * Given that server will return valid user on form submission
   */
  const user = {} as UserRegMutation_registration_user;

  const { ui, mockRegUser, mockUpdateLocalUser } = makeComp();

  mockRegUser.mockResolvedValue({
    data: {
      registration: { user }
    }
  });

  /**
   * When we interact with the component
   */
  const { getByText, getByLabelText } = render(ui);

  /**
   * Then we should see that the submit button is disabled
   */
  const $button = getByText(submitBtnPattern);
  expect($button).toBeDisabled();

  /**
   * And source filled is pre-filled
   */
  const $source = getByLabelText("Source") as any;
  expect($source.value).toBe("password");

  /**
   * And source field is greyed out
   */
  expect($source).toHaveAttribute("readonly");
  expect(($source.closest(".form-field") as any).classList).toContain(
    "disabled"
  );

  /**
   * When we complete the form
   */
  fillForm(getByLabelText);

  /**
   * Then submit button should be enabled
   */
  expect($button).not.toHaveAttribute("disabled");

  /**
   * When we submit the form
   */
  fireEvent.click($button);

  /**
   * Then correct value should be sent to the server
   */
  await wait(() => {
    expect(mockRegUser.mock.calls[0][0].variables.input).toEqual({
      name: "Kanmii",
      email: "me@me.com",
      password: "awesome pass",
      passwordConfirmation: "awesome pass",
      source: "password"
    });
  });

  /**
   * And user data received from server should be saved locally
   */
  expect(mockUpdateLocalUser.mock.calls[0][0].variables.user).toEqual(user);

  /**
   * And the page should not be scrolled
   */
  expect(mockScrollToTop).not.toHaveBeenCalled();

  /**
   * And we should redirected
   */
  expect(mockRefreshToMyResumes).toBeCalled();
});

function fillForm(getByLabelText: any) {
  fillField(getByLabelText("Name"), "Kanmii");
  fillField(getByLabelText("Email"), "me@me.com");
  fillField(getByLabelText(passwortMuster), "awesome pass");
  fillField(getByLabelText(passBestMuster), "awesome pass");
}

function fillAndSubmitForm(getByLabelText: any, getByText: any) {
  fillForm(getByLabelText);
  fireEvent.click(getByText(submitBtnPattern));
}

////////////////////////// HELPERS ////////////////////////////

const SignUpP = SignUp as React.FunctionComponent<Partial<Props>>;

function makeComp({
  isConnected = true,
  props = {}
}: { props?: Partial<Props>; isConnected?: boolean } = {}) {
  mockGetConnStatus.mockReset();
  mockGetConnStatus.mockResolvedValue(isConnected);

  mockScrollToTop.mockReset();
  mockRefreshToMyResumes.mockReset();

  const mockRegUser = jest.fn();
  const mockUpdateLocalUser = jest.fn();

  return {
    ui: (
      <SignUpP
        regUser={mockRegUser}
        updateLocalUser={mockUpdateLocalUser}
        {...props}
      />
    ),

    mockRegUser,
    mockUpdateLocalUser
  };
}
