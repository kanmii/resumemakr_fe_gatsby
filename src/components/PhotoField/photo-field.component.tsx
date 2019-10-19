import React, { useContext, useRef, useEffect, memo, useReducer } from "react";
import { Icon, Modal, Button } from "semantic-ui-react";
import "./styles.scss";
import { AppModal } from "../AppModal";
import { FormContext } from "../UpdateResumeForm/update-resume.utils";
import {
  Props,
  uiTexts,
  reducer,
  ActionType,
  initStateFromProps,
  FilledState,
} from "./photo-field.utils";
import {
  previewId,
  fileChooserId,
  deletePhotoId,
  stopPhotoDeleteId,
  changePhotoId,
  photoDeleteConfirmedId,
} from "./photo-field.dom-selectors";

export const PhotoField = memo(PhotoFieldComp, PhotoFieldDiff);

function PhotoFieldComp(props: Props) {
  const {
    field: { value = null, name: fieldName },
    form,
  } = props;

  const [stateMachine, dispatch] = useReducer(
    reducer,
    { value },
    initStateFromProps,
  );

  const formContext = useContext(FormContext);
  const changedRef = useRef<null | boolean>(null);

  useEffect(() => {
    const { current } = changedRef;

    if (current) {
      formContext.valueChanged();
      changedRef.current = false;
    }
  });

  useEffect(() => {
    // formik will first load default values and then initialize with values
    // from server causing two renders. In the first render,
    // changedRef.current === null && value === null | undefined and on second
    // render, changedRef.current === null and
    // value === null | undefined | string
    if (changedRef.current === null && value) {
      changedRef.current = false;

      dispatch({
        type: ActionType.CHANGE_PHOTO,
        value,
      });
    }
  }, [value]);

  function onDelete() {
    changedRef.current = false;
    form.setFieldValue(fieldName, null);

    dispatch({
      type: ActionType.DELETE_PHOTO,
    });

    changedRef.current = true;
  }

  function handleFileUpload(evt: React.SyntheticEvent<HTMLInputElement>) {
    changedRef.current = false;
    const file = (evt.currentTarget.files || [])[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Encoded = reader.result as string;
      form.setFieldValue(fieldName, base64Encoded);

      dispatch({
        type: ActionType.CHANGE_PHOTO,
        value: base64Encoded,
      });

      changedRef.current = true;
    };

    reader.readAsDataURL(file);
  }

  function renderFileInput(label: string) {
    return (
      <>
        <label className="change-photo" htmlFor={fileChooserId}>
          <Icon name="upload" /> {label}
        </label>

        <input
          id={fileChooserId}
          type="file"
          accept="image/*"
          className="input-file"
          name={fieldName}
          onChange={handleFileUpload}
        />
      </>
    );
  }

  function touch() {
    // If user places mouse on the overlay in the
    // region where the remove photo button will be rendered, then the click
    // event is immediately sent to the button. Using setTimeout prevents
    // this (since user may wish to change the photo instead)
    setTimeout(() => {
      dispatch({
        type: ActionType.EDIT_INIT,
      });
    });
  }

  function thumbEventListeners() {
    if (stateMachine.value === "filled") {
      const filled = stateMachine.filled;

      if (filled.value === "preview") {
        return {
          onMouseOver: touch,
        };
      } else if (
        filled.value === "editing" &&
        filled.editing.value !== "startPhotoDelete"
      ) {
        return {
          onMouseLeave() {
            dispatch({
              type: ActionType.PREVIEW,
            });
          },
        };
      }
    }

    return {};
  }

  function renderThumb() {
    return (
      <div
        className="components-photo-field thumb"
        data-testid="photo-preview"
        id={previewId}
        style={{
          backgroundImage: (stateMachine as FilledState).filled.context.url,
        }}
        {...thumbEventListeners()}
      >
        {(stateMachine as FilledState).filled.value == "editing" && (
          <div id={changePhotoId} className="editor-container">
            {renderFileInput(uiTexts.changePhotoText)}

            <label
              className="change-photo"
              onClick={() => {
                dispatch({
                  type: ActionType.START_PHOTO_DELETE,
                });
              }}
              id={deletePhotoId}
            >
              <Icon name="delete" />
              {uiTexts.deletePhotoText}
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {stateMachine.value === "filled" && renderThumb()}

      {(stateMachine.value === "empty" || stateMachine.value === "deleted") && (
        <div className="components-photo-field file-chooser">
          <div className="upload-photo-icon-wrapper">
            <Icon name="camera" />
          </div>

          {renderFileInput(uiTexts.uploadPhotoText)}
        </div>
      )}

      <AppModal
        open={
          stateMachine.value === "filled" &&
          stateMachine.filled.value === "editing" &&
          stateMachine.filled.editing.value === "startPhotoDelete"
        }
        onClose={() => {
          dispatch({
            type: ActionType.PREVIEW,
          });
        }}
      >
        <Modal.Header>{uiTexts.dialogHeader}</Modal.Header>

        <Modal.Content>
          <Modal.Description>
            <div>{uiTexts.deletePhotoConfirmationText}</div>
          </Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button
            id={stopPhotoDeleteId}
            positive={true}
            icon="remove"
            labelPosition="right"
            content={uiTexts.negativeToRemovePhotoText}
            onClick={() => {
              dispatch({
                type: ActionType.PREVIEW,
              });
            }}
          />

          <Button
            negative={true}
            icon="checkmark"
            labelPosition="right"
            content={uiTexts.positiveToRemovePhotoText}
            onClick={onDelete}
            id={photoDeleteConfirmedId}
          />
        </Modal.Actions>
      </AppModal>
    </>
  );
}

/**
 * We set both values to null because the values can either be null or
 * undefined so we always get null if we receive undefined
 */
function PhotoFieldDiff(
  { field: { value: value1 = null } }: Props,
  { field: { value: value2 = null } }: Props,
) {
  return value1 === value2;
}
