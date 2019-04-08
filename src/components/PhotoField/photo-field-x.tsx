import React, { useContext, useState, useRef, useEffect } from "react";
import { Icon, Modal, Button } from "semantic-ui-react";

import "./styles.scss";
import { AppModal } from "../../styles/mixins";
import { toServerUrl } from "../utils";
import { FormContext } from "../ResumeForm/resume-form";
import { Props, PhotoFieldState, uiTexts } from "./photo-field";

export function PhotoField(props: Props) {
  const { field, form } = props;
  const formContext = useContext(FormContext);
  const [fileState, setFileState] = useState(PhotoFieldState.clean);
  const [url, setUrl] = useState<string | undefined>();
  const [openModal, setOpenModal] = useState(false);

  /**
   * Initialized with the value of the photo field path on the server
   */
  const currentValueRef = useRef<string | null>(field.value);

  useEffect(() => {
    toUrl(field.value);
  }, []);

  useEffect(() => {
    const { value } = field;

    /**
     * We only update state if user selected a different photo than the one
     * currently in state
     */
    if (value && currentValueRef.current !== value) {
      toUrl(value);
    }

    currentValueRef.current = value;
  }, [field.value]);

  function toUrl(file: File | null | string) {
    if (!file) {
      return;
    }

    /**
     * The file may either be a path string from server or base64 encoded
     * string from client file
     */
    if ("string" === typeof file) {
      setUrl(`url(${toServerUrl(file)})`);
      setFileState(PhotoFieldState.previewing);
      return;
    }

    /**
     * If we are selecting using browser file picker, then we get a File
     * instance
     */
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Encoded = reader.result as string;
      valueChanged(base64Encoded);
      setUrl(`url(${base64Encoded})`);
      setFileState(PhotoFieldState.previewing);
    };

    reader.readAsDataURL(file);
  }

  function valueChanged(file: string | null) {
    form.setFieldValue(field.name, file);
    formContext.valueChanged();
  }

  function touch() {
    setFileState(PhotoFieldState.touched);
  }

  function unTouch() {
    setFileState(PhotoFieldState.previewing);
  }

  function onDelete() {
    setFileState(PhotoFieldState.deleted);
    setUrl(undefined);
    setOpenModal(false);
    valueChanged(null);
  }

  function handleFileUpload(evt: React.SyntheticEvent<HTMLInputElement>) {
    const file = (evt.currentTarget.files || [])[0];

    if (!file) {
      return;
    }

    toUrl(file);
  }

  function renderFileInput(label: string) {
    const { name: fieldName } = field;

    return (
      <>
        <label className="change-photo" htmlFor={fieldName}>
          <Icon name="upload" /> {label}
        </label>

        <input
          type="file"
          accept="image/*"
          className="input-file"
          name={fieldName}
          id={fieldName}
          onChange={handleFileUpload}
        />
      </>
    );
  }

  function renderThumb() {
    if (!url) {
      return null;
    }

    return (
      <div
        className="components-photo-field thumb"
        data-testid="photo-preview"
        onClick={touch}
        onMouseLeave={unTouch}
        onMouseEnter={touch}
        style={{
          backgroundImage: url
        }}
      >
        {fileState === PhotoFieldState.touched && (
          <div className="editor-container" data-testid="edit-btns">
            {renderFileInput(uiTexts.changePhotoText)}

            <label
              className="change-photo"
              onClick={evt => {
                evt.stopPropagation();
                setOpenModal(true);
              }}
            >
              <Icon name="delete" /> {uiTexts.deletePhotoText}
            </label>
          </div>
        )}
      </div>
    );
  }

  function renderModal() {
    return (
      <AppModal open={openModal}>
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
              setOpenModal(false);
            }}
          />

          <Button
            negative={true}
            icon="checkmark"
            labelPosition="right"
            content={uiTexts.positiveToRemovePhotoText}
            onClick={onDelete}
          />
        </Modal.Actions>
      </AppModal>
    );
  }

  return (
    <>
      {(fileState === PhotoFieldState.previewing ||
        fileState === PhotoFieldState.touched) &&
        renderThumb()}

      {(fileState === PhotoFieldState.clean ||
        fileState === PhotoFieldState.deleted) && (
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

export default PhotoField;
