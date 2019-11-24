import React, { useState } from "react";
import { FieldProps } from "formik";
import { Form, Input, Icon } from "semantic-ui-react";
import { Link } from "gatsby";
import "./password-input.styles.scss";
import { PASSWORD_RESET_PATH } from "../../routing";
import { domShowIconId, domHideIconId } from "./password-input.dom-selectors";

type PwdType = "password" | "text";

interface Props<TFormValues> extends FieldProps<TFormValues> {
  pwdType?: PwdType;
  onToggle: (type: PwdType) => void;
  id?: string;
  onPasswordResetClicked: () => void
}

export function PasswordInput<T>(props: Props<T>) {
  const { field } = props;
  const id = props.id || makeId(field.name);

  const [pwdType, setPwdType] = useState<PwdType>("password");

  return (
    <Form.Field className="components-pwd-input">
      <label data-testid="pass-input-comp" htmlFor={id} className="input-label">
        <span>Password</span>

        <Link
          to={PASSWORD_RESET_PATH}
          tabIndex={-1}
          style={{
            fontStyle: "italic",
          }}
        >
          Forgotten your password?
        </Link>
      </label>

      <Input icon={true} placeholder="" data-testid={id}>
        <input {...field} type={pwdType} autoComplete="off" id={id} />

        {pwdType === "password" && field.value && (
          <Icon
            name="eye"
            className="link"
            data-testid="password-unmask"
            id={domShowIconId}
            onClick={() => setPwdType("text")}
          />
        )}

        {pwdType === "text" && field.value && (
          <Icon
            name="eye slash"
            className="link"
            data-testid="password-mask"
            id={domHideIconId}
            onClick={() => setPwdType("password")}
          />
        )}
      </Input>
    </Form.Field>
  );
}

export function makeId(name: string) {
  return `pwd-input-${name}`;
}
