import { Reducer } from "react";
import { wrapReducer } from "../../logger";
import immer from "immer";
import {
  emailValidationSchema,
  passwordValidationSchema,
  PasswordConfirmationValidationSchema,
} from "../components.utils";
import { ResetPasswordSimpleGraphqlProps } from "../../graphql/apollo/reset-password.mutation";
import * as Yup from "yup";
import { ApolloError } from "apollo-client";
import {
  FormFieldState,
  FormFieldEditChanging,
  FormFieldInvalid,
} from "../components.types";

export enum ActionTypes {
  FORM_CHANGED = "@reset-password/form-field-changed",
  FORM_FIELD_BLURRED = "@reset-password/form-field-blurred",
  SUBMIT = "@reset-password/submit",
  SUBMITTING = "@reset-password/submitting",
  SUBMIT_SUCCESS = "@reset-password/submit-success",
  CLOSE = "@reset-password/close",
  SERVER_ERRORS = "@reset-password/server-errors",
}

type ValidationSchemaShape = Editable["editable"]["form"]["context"];

export const validationSchema = Yup.object<ValidationSchemaShape>().shape({
  email: emailValidationSchema,
  password: passwordValidationSchema,
  passwordConfirmation: PasswordConfirmationValidationSchema,
});

export const reducer: Reducer<StateMachine, Action> = (state, action) =>
  wrapReducer(
    state,
    action,
    (prevState, { type, ...payload }) => {
      return immer(prevState, proxy => {
        switch (type) {
          case ActionTypes.FORM_CHANGED:
            {
              const { fieldName, value } = payload as FormFieldChangedPayload;
              const form = (proxy as Editable).editable.form;
              const formFields = (proxy as Editable).editable.form.fields;

              const formField = (formFields[
                fieldName as KeyOfFormState
              ] as FormFieldState).edit;

              form.context[fieldName] = value;
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
                const validity = fieldState.validity;
                let formValid: boolean | null = null;

                try {
                  validationSchema.validateSyncAt(fieldName, formState.context);

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

          case ActionTypes.CLOSE:
            {
              proxy.value = "closed";
            }

            break;

          case ActionTypes.SERVER_ERRORS:
            {
              const {
                error: { graphQLErrors, networkError },
              } = payload as ServerErrorsPayload;

              const serverErrorsState = proxy as ServerErrors;
              serverErrorsState.value = "serverErrors";
              serverErrorsState.serverErrors = {
                context: {
                  errors: "",
                },
              };

              if (networkError) {
                serverErrorsState.serverErrors.context.errors =
                  networkError.message;
                return;
              }

              serverErrorsState.serverErrors.context.errors =
                graphQLErrors[0].message;
            }

            break;
        }
      });
    },
    //  true,
  );

export function initiState(props: Props): StateMachine {
  const { email = "" } = props;

  return {
    value: "editable",
    editable: {
      form: {
        context: {
          email,
          password: "",
          passwordConfirmation: "",
        },
        fields: {
          email: makeInitialEmailState(email),
          password: {
            edit: {
              value: "unchanged",
            },
            validity: {
              value: "unvalidated",
            },
          },
          passwordConfirmation: {
            edit: {
              value: "unchanged",
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
    },
    validity: {
      value: "unvalidated",
    },
  };

  if (value) {
    formState.edit.value = "changed";

    try {
      validationSchema.validateSyncAt("email", { email: value } as Yup.Shape<
        ValidationSchemaShape,
        ValidationSchemaShape
      >);
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

interface ServerErrors {
  value: "serverErrors";
  serverErrors: {
    context: {
      errors: string;
    };
  };
}

export type StateMachine =
  | {
      value: "submitting";
    }
  | {
      value: "submitSuccess";
    }
  | {
      value: "closed";
    }
  | Editable
  | ServerErrors;

export interface Editable {
  value: "editable";
  editable: {
    form: {
      context: {
        email: string;
        password: string;
        passwordConfirmation: string;
      };
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

interface ServerErrorsPayload {
  error: ApolloError;
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
      type: ActionTypes.CLOSE;
    }
  | ({
      type: ActionTypes.SERVER_ERRORS;
    } & ServerErrorsPayload);
