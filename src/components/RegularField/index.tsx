import React, { useContext, ComponentType } from "react";
import { FieldProps } from "formik";
import { Input, Form } from "semantic-ui-react";

import { FormContext } from "../UpdateResumeForm/utils";

interface Props<Values> extends FieldProps<Values> {
  label: string | JSX.Element;
  // tslint:disable-next-line:no-any
  comp?: ComponentType<any>;
}

export function RegularField<Values>(props: Props<Values>) {
  const { field, label, comp: Component = Input } = props;

  const { value, name } = field;

  const { valueChanged } = useContext(FormContext);

  return (
    <Form.Field>
      {"string" === typeof label ? (
        <label htmlFor={name}>{label}</label>
      ) : (
        label
      )}

      <Component
        {...field}
        value={value || ""}
        id={field.name}
        onBlur={() => {
          valueChanged();
        }}
      />
    </Form.Field>
  );
}
