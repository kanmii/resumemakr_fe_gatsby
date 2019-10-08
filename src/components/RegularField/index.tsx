import React, { useContext, ComponentType } from "react";
import { FieldProps } from "formik";
import { Input, Form } from "semantic-ui-react";
import { FormContext } from "../UpdateResumeForm/update-resume.utils";

interface Props<Values> extends FieldProps<Values> {
  label: string | JSX.Element;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  comp?: ComponentType<any>;
  id?: string;
}

export function RegularField<Values>(props: Props<Values>) {
  const { field, label, comp: Component = Input, id } = props;
  const { value, name } = field;
  const { valueChanged } = useContext(FormContext);

  return (
    <Form.Field>
      {"string" === typeof label ? (
        <label htmlFor={id || name}>{label}</label>
      ) : (
        label
      )}

      <Component
        {...field}
        value={value || ""}
        id={id || name}
        onBlur={valueChanged}
      />
    </Form.Field>
  );
}
