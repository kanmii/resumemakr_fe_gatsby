import React from "react";
import { FieldProps } from "formik";
import { Input, Form } from "semantic-ui-react";

import { FormContext } from "../ResumeForm/resume-form";

interface Props<Values> extends FieldProps<Values> {
  label: string | JSX.Element;
  // tslint:disable-next-line:no-any
  comp?: React.ComponentClass<any>;
}

export class RegularField<Values> extends React.Component<Props<Values>, {}> {
  static contextType = FormContext;
  context!: React.ContextType<typeof FormContext>;

  render() {
    const { field, label, comp: Component = Input } = this.props;

    const { value, name } = field;

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
          onBlur={this.context.valueChanged}
        />
      </Form.Field>
    );
  }
}

// RegularField.contextType = FormContext;

export default RegularField;
