import {
  FormFieldState,
  FormFieldEditChanging,
  FormFieldInvalid,
} from "../components.types";
import { ResumeTitlesFrag_edges_node } from "../../graphql/apollo-types/ResumeTitlesFrag";
import { UpdateResumeMinimalProps } from "../../graphql/apollo/update-resume.mutation";
import { Reducer } from "react";
import { wrapReducer } from "../../logger";
import immer from "immer";
import { ApolloError } from "apollo-client";
import * as Yup from "yup";

export function initState(props: Props): StateMachine {
  const resume = (props.resume || {
    title: "",
    description: "",
  }) as ResumeTitlesFrag_edges_node;

  return {
    value: "editable",
    editable: {
      form: {
        context: {
          title: resume.title,
          description: resume.description as string,
        },

        fields: {
          title: {
            edit: {
              value: "unchanged",
            },
            validity: {
              value: "unvalidated",
            },
          },
          description: {
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

        mode: {
          value: "update",
          update: {
            context: {
              resume,
            },
          },
        },
      },
    },
  };
}

export enum ActionType {
  CLOSE = "@create-update-clone-resume/close",
  SUBMIT = "@create-update-clone-resume/submit",
  SUBMITTING = "@create-update-clone-resume/submitting",
  SUBMIT_SUCCESS = "@create-update-clone-resume/submit-success",
  SERVER_ERRORS = "@create-update-clone-resume/server-error",
  FORM_CHANGED = "@create-update-clone-resume/form-changed",
  FORM_FIELD_BLURRED = "@create-update-clone-resume/form-blurred",
}

const validationSchema = Yup.object<ValidationSchemaShape>().shape({
  title: Yup.string()
    .required()
    .min(2),
  description: Yup.string(),
});

export const reducer: Reducer<StateMachine, Action> = (state, action) =>
  wrapReducer(
    state,
    action,
    (prevState, { type, ...payload }) => {
      return immer(prevState, proxy => {
        switch (type) {
          case ActionType.CLOSE:
            {
              proxy.value = "closed";
            }

            break;

          case ActionType.FORM_CHANGED:
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

          case ActionType.FORM_FIELD_BLURRED:
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
                    validCount === 2 ? "valid" : "invalid";
                }
              }
            }

            break;

          case ActionType.SUBMITTING:
            {
              proxy.value = "submitting";
            }

            break;

          case ActionType.SUBMIT_SUCCESS:
            {
              proxy.value = "submitSuccess";
            }

            break;
        }
      });
    },
    // true,
  );

export const uiTexts = {
  cloneFromTitle: "Clone from:",
  updateResume: "Update: ",

  form: {
    title: "Title e.g. name of company to send to",
    description: "Description",
    submitBtnText: "Yes",
    closeModalBtnText: "Close",
  },
};

export enum Mode {
  create = "@mode/create",
  update = "@mode/update",
  clone = "@mode/clone",
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
        title: string;
        description: string;
      };
      fields: FormState;
      validity: {
        value: "valid" | "invalid";
      };
      mode: ModeState;
    };
  };
}

interface ModeContext {
  context: {
    resume: ResumeTitlesFrag_edges_node;
  };
}

type ModeState =
  | UpdateMode
  | {
      value: "create";
    }
  | CloneMode;

interface UpdateMode {
  value: "update";
  update: ModeContext;
}

interface CloneMode {
  value: "clone";
  clone: ModeContext;
}

interface FormState {
  title: FormFieldState;
  description: FormFieldState;
}

interface ServerErrors {
  value: "serverErrors";
  serverErrors: {
    context: {
      errors: string;
      title: string;
    };
  };
}

export interface OwnProps {
  mode: Mode;
  resume?: ResumeTitlesFrag_edges_node;
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
      type: ActionType.FORM_CHANGED;
    } & FormFieldChangedPayload)
  | {
      type: ActionType.SUBMIT;
    }
  | ({
      type: ActionType.FORM_FIELD_BLURRED;
    } & FormFieldBlurredPayload)
  | {
      type: ActionType.SUBMITTING;
    }
  | {
      type: ActionType.SUBMIT_SUCCESS;
    }
  | {
      type: ActionType.CLOSE;
    }
  | ({
      type: ActionType.SERVER_ERRORS;
    } & ServerErrorsPayload);

export type Props = OwnProps & UpdateResumeMinimalProps;

type ValidationSchemaShape = Editable["editable"]["form"]["context"];
