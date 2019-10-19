/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  render,
  fireEvent,
  wait,
  waitForElement,
} from "@testing-library/react";
import { SignUp } from "../components/SignUp/signup.component";
import { Props } from "../components/SignUp/signup.utils";
import { fillField } from "./test_utils";
import { refreshToMyResumes } from "../utils/refresh-to-my-resumes";
import { isConnected } from "../state/get-conn-status";
import { scrollToTop } from "../components/SignUp/scroll-to-top";
import { UserRegMutation_registration_user } from "../graphql/apollo-types/UserRegMutation";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";
import {
  domPasswordInputId,
  domPasswordConfirmInputId,
  domNameInputId,
  domEmailInputId,
  domSubmitBtnId,
  domErrorsId,
  domSourceInputId,
} from "../components/SignUp/signup.dom-selectors";

jest.mock("../utils/refresh-to-my-resumes");
jest.mock("../state/get-conn-status");
jest.mock("../components/SignUp/scroll-to-top");

const mockRefreshToMyResumes = refreshToMyResumes as jest.Mock;
const mockGetConnStatus = isConnected as jest.Mock;
const mockScrollToTop = scrollToTop as jest.Mock;

it("renders error if password and password confirm are not same", async () => {
  /**
   * Given we are using the component
   */
  const { ui } = makeComp();
  render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(document.getElementById(domErrorsId) as HTMLElement).toBeNull();

  /**
   * When we complete the form with different password and password
   * confirmation and submit the form
   */
  fillField(document.getElementById(domNameInputId) as HTMLElement, "Kanmii");
  fillField(
    document.getElementById(domEmailInputId) as HTMLElement,
    "me@me.com",
  );

  fillField(
    document.getElementById(domPasswordInputId) as HTMLElement,
    "awesome pass",
  );

  fillField(
    document.getElementById(domPasswordConfirmInputId) as HTMLElement,
    "awesome pass1",
  );

  (document.getElementById(domSubmitBtnId) as HTMLButtonElement).click();

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => {
    return document.getElementById(domErrorsId) as HTMLElement;
  });

  expect($error.textContent).toContain("nicht");

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
            errors: { email: "email" },
          }),
        ),
      ],
    }),
  );

  /**
   * When we interact the component
   */
  render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(document.getElementById(domErrorsId) as HTMLElement).toBeNull();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm();

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(
    () => document.getElementById(domErrorsId) as HTMLElement,
  );

  expect($error.textContent).toContain("email");

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
  expect(document.getElementById(domErrorsId) as HTMLElement).toBeNull();
});

it("renders error if nicht verbinden", async () => {
  /**
   * Given that server is not connected
   */
  const { ui } = makeComp({ isConnected: false });

  /**
   * When we interact the component
   */
  render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(document.getElementById(domErrorsId)).toBeNull();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm();

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => {
    return document.getElementById(domErrorsId);
  });

  expect($error).not.toBeNull();

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
      registration: { user: null },
    },
  });

  /**
   * When we interact with the component
   */
  render(ui);

  /**
   * Then we should not see any error UI
   */
  expect(document.getElementById(domErrorsId)).toBeNull();

  /**
   * When we complete and submit the form
   */
  fillAndSubmitForm();

  /**
   * Then we should see error UI
   */
  const $error = await waitForElement(() => {
    return document.getElementById(domErrorsId) as HTMLElement;
  });

  expect($error.textContent).toContain("fail");

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
      registration: { user },
    },
  });

  /**
   * When we interact with the component
   */
  render(ui);

  /**
   * Then we should see that the submit button is disabled
   */
  const $button = document.getElementById(domSubmitBtnId) as HTMLButtonElement;
  expect($button.disabled).toBe(true);

  /**
   * And source filled is pre-filled
   */
  const $source = document.getElementById(domSourceInputId) as HTMLInputElement;
  expect($source.value).toBe("password");

  /**
   * And source field is greyed out
   */
  expect($source.readOnly).toBe(true);
  expect(($source.closest(".form-field") as any).classList).toContain(
    "disabled",
  );

  /**
   * When we complete the form
   */
  fillForm();

  /**
   * Then submit button should be enabled
   */
  expect($button.disabled).toBe(false);

  /**
   * When we submit the form
   */
  $button.click();

  /**
   * Then correct value should be sent to the server
   */
  await wait(() => {
    expect(mockRegUser.mock.calls[0][0].variables.input).toEqual({
      name: "Kanmii",
      email: "me@me.com",
      password: "awesome pass",
      passwordConfirmation: "awesome pass",
      source: "password",
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

function fillForm() {
  fillField(
    document.getElementById(domNameInputId) as HTMLInputElement,
    "Kanmii",
  );

  fillField(
    document.getElementById(domEmailInputId) as HTMLElement,
    "me@me.com",
  );

  fillField(
    document.getElementById(domPasswordInputId) as HTMLElement,
    "awesome pass",
  );

  fillField(
    document.getElementById(domPasswordConfirmInputId) as HTMLElement,
    "awesome pass",
  );
}

function fillAndSubmitForm() {
  fillForm();
  (document.getElementById(domSubmitBtnId) as HTMLButtonElement).click();
}

////////////////////////// HELPERS ////////////////////////////

const SignUpP = SignUp as React.FunctionComponent<Partial<Props>>;

function makeComp({
  isConnected = true,
  props = {},
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
    mockUpdateLocalUser,
  };
}
