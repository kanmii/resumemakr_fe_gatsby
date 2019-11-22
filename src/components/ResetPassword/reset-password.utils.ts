import { Reducer } from "react";
import { wrapReducer } from "../../logger";
import immer from "immer";
import {
  emailValidationSchema,
  passwordValidationSchema,
} from "../components.utils";
import { StringSchema } from "yup";
import { ResetPasswordSimpleGraphqlProps } from "../../graphql/apollo/reset-password.mutation";
import { RouteComponentProps } from "@reach/router";

export enum ActionTypes {
  FORM_CHANGED = "@reset-password/form-field-changed",
  FORM_FIELD_BLURRED = "@reset-password/form-field-blurred",
  SUBMIT = "@reset-password/submit",
  SUBMITTING = "@reset-password/submitting",
  SUBMIT_SUCCESS = "@reset-password/submit-success",
  DESTROY = "@reset-password/destroy",
}

export const validationSchema: { [k in KeyOfFormState]: StringSchema } = {
  email: emailValidationSchema,
  password: passwordValidationSchema,
  passwordConfirmation: passwordValidationSchema,
};

export const reducer: Reducer<IStateMachine, Action> = (state, action) =>
  wrapReducer(
    state,
    action,
    (prevState, { type, ...payload }) => {
      return immer(prevState, proxy => {
        switch (type) {
          case ActionTypes.FORM_CHANGED:
            {
              const { fieldName, value } = payload as FormFieldChangedPayload;
              const formFields = (proxy as Editable).editable.form.fields;

              const formField = formFields[
                fieldName as KeyOfFormState
              ] as FormFieldState;

              formField.context.value = value;
              formField.value = "edit";
              const formFieldEdit = formField as FormFieldEdit;

              formFieldEdit.edit = formFieldEdit.edit || {
                value: "changing",
              };
            }

            break;

          case ActionTypes.FORM_FIELD_BLURRED:
            {
              const { fieldName } = payload as FormFieldBlurredPayload;
              const formState = (proxy as Editable).editable.form;
              const fieldStates = formState.fields;

              const fieldState = fieldStates[
                fieldName as KeyOfFormState
              ] as FormFieldState;

              if (fieldState.value === "edit") {
                const value = fieldState.context.value;
                let formValid: boolean | null = null;

                try {
                  validationSchema[fieldName].validateSync(value);
                  fieldState.edit.value = "valid";
                } catch (error) {
                  formValid = false;
                  formState.validity.value = "invalid";
                  const formFieldInvalid = fieldState.edit as FormFieldEditInvalid;
                  formFieldInvalid.value = "invalid";
                  formFieldInvalid.invalid = {
                    context: {
                      error: error.message,
                    },
                  };
                }

                if (formValid === null) {
                  let validCount = 0;
                  for (const value of Object.values(fieldStates)) {
                    const state = value as FormFieldState;

                    if (
                      state.value === "edit" &&
                      state.edit.value === "valid"
                    ) {
                      ++validCount;
                    } else {
                      // if a field has not been edited, there is no point checking other fields
                      break;
                    }
                  }

                  formState.validity.value =
                    validCount === 3 ? "valid" : "invalid";
                }
              }
            }

            break;

          case ActionTypes.SUBMITTING:
            {
              proxy.value = "submitting";
            }

            break;

          case ActionTypes.SUBMIT_SUCCESS:
            {
              proxy.value = "submitSuccess";
            }

            break;

          case ActionTypes.DESTROY:
            {
              proxy.value = "destroyed";
            }

            break;
        }
      });
    },
    //  true,
  );

export function initiState(props: Props): IStateMachine {
  const { email } = props;

  return {
    value: "editable",
    editable: {
      form: {
        fields: {
          email: makeInitialEmailState(email),
          password: {
            value: "idle",
            context: {
              value: "",
            },
          },
          passwordConfirmation: {
            value: "idle",
            context: {
              value: "",
            },
          },
        },
        validity: {
          value: "invalid",
        },
      },
    },
  };
}

function makeInitialEmailState(value: string): FormFieldState {
  const formState = {
    value: "idle",
    context: {
      value,
    },
  } as FormFieldState;

  if (value) {
    const emailEdit = formState as FormFieldEdit;
    emailEdit.value = "edit";
    emailEdit.edit = {
      value: "valid",
    };

    try {
      validationSchema.email.validateSync(value);
    } catch (error) {
      emailEdit.edit = {
        value: "invalid",
        invalid: {
          context: {
            error: error.message,
          },
        },
      };
    }
  }

  return formState;
}

type IStateMachine =
  | {
      value: "submitting";
    }
  | {
      value: "submitSuccess";
    }
  | {
      value: "destroyed";
    }
  | Editable;

export interface Editable {
  value: "editable";
  editable: {
    form: {
      fields: FormState;
      validity: {
        value: "valid" | "invalid";
      };
    };
  };
}

interface FormState {
  email: FormFieldState;
  password: FormFieldState;
  passwordConfirmation: FormFieldState;
}

type FormFieldState = {
  context: {
    value: string;
  };
} & (
  | {
      value: "idle";
    }
  | FormFieldEdit
  | FormConrolServerError);

interface FormFieldEdit {
  value: "edit";
  edit:
    | {
        value: "changing";
      }
    | {
        value: "valid";
      }
    | FormFieldEditInvalid;
}

interface FormFieldEditInvalid {
  value: "invalid";
  invalid: {
    context: {
      error: string;
    };
  };
}

interface FormConrolServerError {
  value: "serverError";
  context: {
    error: string;
  };
}

export interface Props
  extends ResetPasswordSimpleGraphqlProps,
    RouteComponentProps {
  email: string;
}

type KeyOfFormState = keyof FormState;

interface FormFieldChangedPayload {
  value: string;
  fieldName: KeyOfFormState;
}

interface FormFieldBlurredPayload {
  fieldName: KeyOfFormState;
}

export type Action =
  | ({
      type: ActionTypes.FORM_CHANGED;
    } & FormFieldChangedPayload)
  | {
      type: ActionTypes.SUBMIT;
    }
  | ({
      type: ActionTypes.FORM_FIELD_BLURRED;
    } & FormFieldBlurredPayload)
  | {
      type: ActionTypes.SUBMITTING;
    }
  | {
      type: ActionTypes.SUBMIT_SUCCESS;
    }
  | {
      type: ActionTypes.DESTROY;
    };
