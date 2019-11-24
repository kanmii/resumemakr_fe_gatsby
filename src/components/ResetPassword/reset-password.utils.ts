import { Reducer } from "react";
import { wrapReducer } from "../../logger";
import immer from "immer";
import {
  emailValidationSchema,
  passwordValidationSchema,
} from "../components.utils";
import { StringSchema } from "yup";
import { ResetPasswordSimpleGraphqlProps } from "../../graphql/apollo/reset-password.mutation";

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

              const formField = (formFields[
                fieldName as KeyOfFormState
              ] as FormFieldState).edit;

              formField.context.value = value;
              formField.value = "changing";
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

              const editingState = fieldState.edit as FormFieldEditChanging;

              if (editingState.value === "changing") {
                const value = fieldState.edit.context.value;
                const validity = fieldState.validity;
                let formValid: boolean | null = null;

                try {
                  validationSchema[fieldName].validateSync(value);
                  fieldState.edit.value = "changed";
                  validity.value = "valid";
                } catch (error) {
                  formValid = false;
                  validity.value = "invalid";
                  const invalidState = validity as FormFieldInvalid;
                  invalidState.invalid = {
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
                      state.edit.value === "changed" &&
                      state.validity.value === "valid"
                    ) {
                      ++validCount;
                    } else {
                      // if a field has not been changed, there is no point checking other fields
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
            edit: {
              value: "unchanged",
              context: {
                value: "",
              },
            },
            validity: {
              value: "unvalidated",
            },
          },
          passwordConfirmation: {
            edit: {
              value: "unchanged",
              context: {
                value: "",
              },
            },
            validity: {
              value: "unvalidated",
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
  const formState: FormFieldState = {
    edit: {
      value: "unchanged",
      context: {
        value,
      },
    },
    validity: {
      value: "unvalidated",
    },
  };

  if (value) {
    formState.edit.value = "changed";

    try {
      validationSchema.email.validateSync(value);
      formState.validity.value = "valid";
    } catch (error) {
      formState.validity = {
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

interface FormFieldState {
  edit: FormFieldEdit;
  validity: FormFieldValidity;
}

type FormFieldValidity =
  | {
      value: "unvalidated";
    }
  | {
      value: "valid";
    }
  | FormFieldInvalid;

type FormFieldEdit = {
  context: {
    value: string;
  };
} & (
  | {
      value: "unchanged";
    }
  | FormFieldEditChanged
  | FormFieldEditChanging);

interface FormFieldEditChanged {
  value: "changed";
}

interface FormFieldEditChanging {
  value: "changing";
}

interface FormFieldInvalid {
  value: "invalid";
  invalid: {
    context: {
      error: string;
    };
  };
}

export interface Props extends ResetPasswordSimpleGraphqlProps {
  email: string;
  onClose: () => void;
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
