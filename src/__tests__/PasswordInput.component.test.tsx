import React from "react";
import { render, cleanup } from "@testing-library/react";
import { Formik, Field } from "formik";
import { PasswordInput } from "../components/PasswordInput/password-input.index";
import {
  domHideIconId,
  domShowIconId,
} from "../components/PasswordInput/password-input.dom-selectors";
import { fillField } from "./test_utils";

it("renders correctly", () => {
  const name = "pwd";
  const id = "id";

  const Ui = function App() {
    return (
      <Formik
        onSubmit={() => null}
        initialValues={{ [name]: "" }}
        validateOnChange={false}
        render={() => <Field id={id} name={name} component={PasswordInput} />}
      />
    );
  };

  /**
   * Given a user of password component
   */
  render(<Ui />);

  /**
   * And that if password is field is empty, there is no UI element
   * showing that password can be revealed
   */
  expect(document.getElementById(domShowIconId)).toBeNull();
  expect(document.getElementById(domHideIconId)).toBeNull();

  /**
   * When user types into the password field
   */
  const $pwd = document.getElementById(id) as HTMLInputElement;
  const pwd = "awesomep";
  fillField($pwd, pwd);

  /**
   * Then user should see UI icon to reveal the hidden password
   */
  expect(document.getElementById(domShowIconId)).not.toBeNull();

  /**
   * Whe the password field is empty again.
   */
  fillField($pwd, "");
  /**
   * Then user should no longer see UI icon that can reveal the hidden password
   */
  expect(document.getElementById(domShowIconId)).toBeNull();

  /**
   * When user types into the password field
   */
  fillField($pwd, pwd);

  /**
   * And clicks the icon to reveal the password
   */
  (document.getElementById(domShowIconId) as HTMLElement).click();

  /**
   * Then icon to reveal the password should disappear
   */
  expect(document.getElementById(domShowIconId)).toBeNull();

  /**
   * When icon to hide password is clicked.
   */
  (document.getElementById(domHideIconId) as HTMLElement).click();

  /**
   * Then icon to hide password should disappear
   */
  expect(document.getElementById(domHideIconId)).toBeNull();

  /**
   * And icon to reveal password should appear
   */
  expect(document.getElementById(domShowIconId)).not.toBeNull();

  cleanup();
});
