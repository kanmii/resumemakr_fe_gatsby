import React from "react";
import { render, fireEvent } from "react-testing-library";
import { Formik, Field } from "formik";

import { makeId, PwdInput } from "../components/PwdInput";

it("renders correctly", () => {
  const name = "pwd";

  const Ui = function App() {
    return (
      <Formik
        onSubmit={() => null}
        initialValues={{ [name]: "" }}
        validateOnChange={false}
        render={() => <Field name={name} component={PwdInput} />}
      />
    );
  };

  const id = makeId(name);

  /**
   * Given a user of password component
   */
  const { container, queryByTestId, getByLabelText, getByTestId } = render(
    <Ui />
  );

  const $comp = container.firstChild as HTMLDivElement;

  /**
   * Then user should see that 'for' attribute is a function of name input
   * field.
   */
  expect(getByTestId("pass-input-comp")).toHaveAttribute("for", id);

  /**
   * And that if password is field is empty, there is no UI element
   * showing that password can be revealed
   */
  expect($comp).not.toContainElement(queryByTestId("password-unmask"));
  expect($comp).not.toContainElement(queryByTestId("password-mask"));

  /**
   * When user types into the password field
   */
  const $pwd = getByLabelText(/Password/i);
  const pwd = "awesome pass";

  fireEvent.change($pwd, {
    target: { value: pwd }
  });

  /**
   * Then user should see UI icon to reveal the hidden password
   */
  expect($comp).toContainElement(getByTestId("password-unmask"));

  /**
   * Whe the password field is empty again.
   */
  fireEvent.change($pwd, {
    target: { value: "" }
  });

  /**
   * Then user should no longer see UI icon that can reveal the hidden password
   */
  expect($comp).not.toContainElement(queryByTestId("password-unmask"));

  /**
   * When user types into the password field
   */
  fireEvent.change($pwd, {
    target: { value: pwd }
  });

  /**
   * And clicks the icon to reveal the password
   */
  fireEvent.click(getByTestId("password-unmask"));

  /**
   * Then icon to reveal the password should disappear
   */
  expect($comp).not.toContainElement(queryByTestId("password-unmask"));

  /**
   * And icon to hide the password should appear
   */
  const $maskPwd = getByTestId("password-mask");
  expect($comp).toContainElement($maskPwd);

  /**
   * When icon to hide password is clicked.
   */
  fireEvent.click($maskPwd);

  /**
   * Then icon to hide password should disappear
   */
  expect($comp).not.toContainElement(queryByTestId("password-mask"));

  /**
   * And icon to reveal password should appear
   */
  expect($comp).toContainElement(getByTestId("password-unmask"));
});
