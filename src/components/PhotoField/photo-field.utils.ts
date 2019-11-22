import { FieldProps } from "formik";
import { toServerUrl } from "../components.utils";
import immer from "immer";
import { Reducer } from "react";
import { wrapReducer } from "../../logger";

export function initStateFromProps({
  value,
}: {
  value?: string | null;
}): StateMachine {
  if (!value) {
    return {
      value: "empty",
    };
  }

  return {
    value: "filled",

    filled: {
      value: "preview",
      context: {
        value,
        url: toUrl(value),
      },
    },
  };
}

export enum ActionType {
  EDIT_INIT = "@photo-field/edit-init",
  PREVIEW = "@photo-field/preview",
  DELETE_PHOTO = "@photo-field/delete-photo",
  CHANGE_PHOTO = "@photo-field/change-photo",
  START_PHOTO_DELETE = "@photo-field/start-photo-delete",
  STOP_PHOTO_DELETE = "@photo-field/stop-photo-delete",
}

export const reducer: Reducer<StateMachine, Action> = (state, action) =>
  wrapReducer(
    state,
    action,
    (prevState, { type, ...payload }) => {
      return immer(prevState, proxy => {
        switch (type) {
          case ActionType.DELETE_PHOTO:
            {
              proxy.value = "deleted";
            }

            break;

          case ActionType.EDIT_INIT:
            {
              const filledState = (proxy as FilledState).filled;

              const editingState = filledState as EditState;

              editingState.value = "editing";

              const editing = editingState.editing || {
                value: "initial",
              };

              editing.value = "initial";
              editingState.editing = editing;
            }

            break;

          case ActionType.PREVIEW:
            {
              (proxy as FilledState).filled.value = "preview";
            }

            break;

          case ActionType.CHANGE_PHOTO:
            {
              const { value } = payload as ChangePayload;
              const context: FilledStateContext = {
                value,
                url: toUrl(value),
              };

              const state = proxy as FilledState;

              if (proxy.value !== "filled") {
                state.value = "filled";
                state.filled = {
                  value: "preview",
                  context,
                };
              } else {
                state.filled.value = "preview";
                state.filled.context = context;
              }
            }

            break;

          case ActionType.START_PHOTO_DELETE:
            {
              const editState = (proxy as FilledState).filled as EditState;
              editState.editing.value = "startPhotoDelete";
            }

            break;

          case ActionType.STOP_PHOTO_DELETE:
            {
              const editState = (proxy as FilledState).filled as EditState;
              editState.editing.value = "initial";
            }

            break;
        }
      });
    },
    // true,
  );

export const uiTexts = {
  uploadPhotoText: "Upload Photo",
  deletePhotoText: "Remove",
  changePhotoText: "Change photo",
  deletePhotoConfirmationText: "Do you really want to remove photo?",
  dialogHeader: "Removing photo",
  negativeToRemovePhotoText: "No",
  positiveToRemovePhotoText: "Yes",
};

function toUrl(value: string) {
  return `url(${toServerUrl(value)})`;
}

export interface Props extends FieldProps<{ photo: string | null }> {
  removeFilePreview?: () => void;
}

type StateMachine = EmptyState | FilledState | DeletedState;

interface DeletedState {
  value: "deleted";
}

interface EmptyState {
  value: "empty";
}

export interface FilledState {
  value: "filled";

  filled: PreviewState | EditState;
}

interface FilledStateContext {
  value: string;
  url: string;
}

interface PreviewState {
  value: "preview";
  context: FilledStateContext;
}

interface EditState {
  value: "editing";
  context: FilledStateContext;

  editing: EditingStateInitial | EditingStateStartPhotoDelete;
}

interface EditingStateInitial {
  value: "initial";
}

interface EditingStateStartPhotoDelete {
  value: "startPhotoDelete";
}

type Action =
  | {
      type:
        | ActionType.DELETE_PHOTO
        | ActionType.EDIT_INIT
        | ActionType.PREVIEW
        | ActionType.START_PHOTO_DELETE
        | ActionType.STOP_PHOTO_DELETE;
    }
  | ({
      type: ActionType.CHANGE_PHOTO;
    } & ChangePayload);

interface ChangePayload {
  value: string;
}
