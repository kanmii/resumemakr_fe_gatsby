import * as Yup from "yup";
import { RouteComponentProps } from "@reach/router";
import { CreateResumeProps } from "../../graphql/apollo/create-resume.mutation";
import { ListResumesProps } from "../../graphql/apollo/resume-titles.query";
import { DeleteResumeProps } from "../../graphql/apollo/delete-resume.mutation";
import { CloneResumeProps } from "../../graphql/apollo/clone-resume.mutation";
import { CreateResumeInput } from "../../graphql/apollo-types/globalTypes";
import { Mode } from "../CreateUpdateCloneResume/create-update-clone-resume.utils";
import { Reducer } from "react";
import { wrapReducer } from "../../logger";
import immer from "immer";
import { ResumeTitlesFrag_edges_node } from "../../graphql/apollo-types/ResumeTitlesFrag";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function initState(props: Props): StateMachine {
  return {
    createUpdateClone: {
      value: "closed",
    },
    updateUITrigger: {
      value: "inactive",
    },
  };
}

export const validationSchema = Yup.object<CreateResumeInput>().shape({
  title: Yup.string()
    .required()
    .min(2),
  description: Yup.string(),
});

export enum ActionType {
  createResume = "CreateResume",
  cloneResume = "CloneResume",
  SHOW_UPDATE_RESUME_UI = "@my-resumes/show-update-resume-ui",
  SHOW_UPDATE_RESUME_UI_TRIGGER = "@my-resumes/show-update-resume-ui-trigger",
  DISMISS_SHOW_UPDATE_RESUME_UI_TRIGGER = "@my-resumes/dismiss-show-update-resume-ui-trigger",
  CREATE_UPDATE_CLONE_UI_CLOSED = "@my-resumes/create-update-clone-resume-ui-closed",
}

export const reducer: Reducer<StateMachine, Action> = (state, action) =>
  wrapReducer(
    state,
    action,
    (prevState, { type, ...payload }) => {
      return immer(prevState, proxy => {
        switch (type) {
          case ActionType.SHOW_UPDATE_RESUME_UI:
            {
              const { updateUITrigger } = proxy;

              if (updateUITrigger.value === "active") {
                proxy.createUpdateClone = {
                  value: "opened",
                  opened: {
                    context: {
                      mode: (payload as CreateUpdateClonePayload).mode,
                      resume: updateUITrigger.active.context.resume,
                    },
                  },
                };

                proxy.updateUITrigger.value = "inactive";
              }
            }

            break;

          case ActionType.CREATE_UPDATE_CLONE_UI_CLOSED:
            {
              proxy.createUpdateClone.value = "closed";
            }

            break;

          case ActionType.SHOW_UPDATE_RESUME_UI_TRIGGER:
            {
              proxy.updateUITrigger = {
                value: "active",
                active: {
                  context: {
                    resume: (payload as TriggerShowUpdateResumeUIPayload)
                      .resume,
                  },
                },
              };
            }

            break;

          case ActionType.DISMISS_SHOW_UPDATE_RESUME_UI_TRIGGER:
            {
              proxy.updateUITrigger.value = "inactive";
            }
            break;
        }
      });
    },
    //  true,
  );

export const emptyVal = { title: "", description: "" };

export const uiTexts = {
  noResumesMsg: "You have no resumes. Click here to create your first resume.",
  deleteSuccessMsg: "deleted successfully",
  confirmDeleteMsg: "Sure to delete:",
  delete: "delete",
  notToDelete: "no to delete",
  cloneFromTitle: "Clone from:",

  form: {
    title: "Title e.g. name of company to send to",
    description: "Description",
    submitBtnText: "Yes",
    closeModalBtnText: "No",
  },
};

export interface OwnProps extends RouteComponentProps<{}> {
  header?: JSX.Element;
  className?: string;
}

export interface Props
  extends CreateResumeProps,
    OwnProps,
    ListResumesProps,
    DeleteResumeProps,
    CloneResumeProps {}

interface StateMachine {
  createUpdateClone: CreateUpdateCloneState;
  updateUITrigger:
    | { value: "inactive" }
    | {
        value: "active";
        active: {
          context: {
            resume: ResumeTitlesFrag_edges_node;
          };
        };
      };
}

type CreateUpdateCloneState =
  | {
      value: "closed";
    }
  | {
      value: "opened";
      opened: {
        context: {
          mode: Mode;
          resume?: ResumeTitlesFrag_edges_node;
        };
      };
    };

interface CreateUpdateClonePayload {
  mode: Mode;
}

interface TriggerShowUpdateResumeUIPayload {
  resume: ResumeTitlesFrag_edges_node;
}

type Action =
  | ({
      type: ActionType.SHOW_UPDATE_RESUME_UI;
    } & CreateUpdateClonePayload)
  | {
      type: ActionType.CREATE_UPDATE_CLONE_UI_CLOSED;
    }
  | ({
      type: ActionType.SHOW_UPDATE_RESUME_UI_TRIGGER;
    } & TriggerShowUpdateResumeUIPayload)
  | {
      type: ActionType.DISMISS_SHOW_UPDATE_RESUME_UI_TRIGGER;
    };
