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
  fileChooser,
  deletePhotoId,
  stopPhotoDeleteId,
} from "./photo-field.dom-selectors";

export const PhotoField = memo(PhotoFieldComp, PhotoFieldDiff);

function PhotoFieldComp(props: Props) {
  const {
    field: { value = null, name: fieldName },
    form,
  } = props;

  const formContext = useContext(FormContext);

  const [stateMachine, dispatch] = useReducer(
    reducer,
    { value },
    initStateFromProps,
  );

  const currentValueRef = useRef<string | null>(value);

  useEffect(() => {
    /**
     * We only update state if user selected a different photo than the one
     * currently in state i.e user changes or deletes photo
     */
    if (currentValueRef.current !== value) {
      currentValueRef.current = value;
      formContext.valueChanged();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [value]);

  function onDelete() {
    form.setFieldValue(fieldName, null);

    dispatch({
      type: ActionType.DELETE_PHOTO,
    });
  }

  function handleFileUpload(evt: React.SyntheticEvent<HTMLInputElement>) {
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
    };

    reader.readAsDataURL(file);
  }

  function renderFileInput(label: string) {
    return (
      <>
        <label className="change-photo" htmlFor={fileChooser}>
          <Icon name="upload" /> {label}
        </label>

        <input
          id={fileChooser}
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
    dispatch({
      type: ActionType.EDIT_INIT,
    });
  }

  function renderThumb() {
    return (
      <div
        className="components-photo-field thumb"
        data-testid="photo-preview"
        id={previewId}
        onClick={touch}
        onMouseLeave={() => {
          dispatch({
            type: ActionType.PREVIEW,
          });
        }}
        onMouseOver={touch}
        style={{
          backgroundImage: (stateMachine as FilledState).filled.context.url,
        }}
      >
        {(stateMachine as FilledState).filled.value == "editing" && (
          <div className="editor-container" data-testid="edit-btns">
            {renderFileInput(uiTexts.changePhotoText)}

            <label
              className="change-photo"
              onClick={evt => {
                evt.stopPropagation();
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

  function renderModal() {
    return (
      <AppModal
        open={
          stateMachine.value === "filled" &&
          stateMachine.filled.value === "editing" &&
          stateMachine.filled.editing.value === "startPhotoDelete"
        }
      >
        <Modal.Header>{uiTexts.dialogHeader}</Modal.Header>

        <Modal.Content>
          <Modal.Description>
            <div>{uiTexts.deletePhotoConfirmationText}</div>
          </Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button
            positive={true}
            icon="remove"
            labelPosition="right"
            content={uiTexts.negativeToRemovePhotoText}
            onClick={() => {
              dispatch({
                type: ActionType.STOP_PHOTO_DELETE,
              });
            }}
          />

          <Button
            negative={true}
            icon="checkmark"
            labelPosition="right"
            content={uiTexts.positiveToRemovePhotoText}
            onClick={onDelete}
            id={stopPhotoDeleteId}
          />
        </Modal.Actions>
      </AppModal>
    );
  }

  return (
    <>
      {stateMachine.value === "filled" && renderThumb()}

      {stateMachine.value === "empty" && (
        <div className="components-photo-field file-chooser">
          <div className="upload-photo-icon-wrapper">
            <Icon name="camera" />
          </div>

          {renderFileInput(uiTexts.uploadPhotoText)}
        </div>
      )}

      {renderModal()}
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
