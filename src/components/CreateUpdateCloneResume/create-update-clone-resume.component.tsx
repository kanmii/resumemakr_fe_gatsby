import React, { useReducer, useRef, useEffect } from "react";
import {
  Props,
  initState,
  uiTexts,
  reducer,
  ActionType,
  Editable,
  StateValue,
} from "./create-update-clone-resume.utils";
import { AppModal } from "../AppModal/app-modal.component";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Input from "semantic-ui-react/dist/commonjs/elements/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import Message from "semantic-ui-react/dist/commonjs/collections/Message";
import { AutoTextarea } from "../AutoTextarea";
import {
  domTitleInputId,
  domDescriptionInputId,
  domSubmitBtnId,
  domPrefix,
  domSubmittingOverlayId,
  domSubmitSuccessId,
  domTitleErrorId,
  domDescriptionErrorId,
  domPrefixSubmittingClass,
  domPrefixSuccessClass,
  domCloseModalBtnId,
  domTitleFieldId,
  domDescriptionFieldId,
  domSubmitServerErrorsId,
  domSubmitServerErrorTextId,
} from "./create-update-clone-resume.dom-selectors";
import makeClassNames from "classnames";
import { SubmittingOverlay } from "../SubmittingOverlay/submitting-overlay.component";
import { FormCtrlError } from "../FormCtrlError/form-ctrl-error.component";
import { domFieldSuccessClass } from "../components.utils";

const CLOSE_TIMEOUT_MS = 60000;

export function CreateUpdateCloneResume(props: Props) {
  const [stateMachine, dispatch] = useReducer(reducer, props, initState);
  const stateValue = stateMachine.value;
  const formState = (stateMachine as Editable).editable.form;
  const formFields = formState.fields;
  const { effects } = stateMachine;

  const closeTimeoutRef = useRef<null | NodeJS.Timeout>(null);

  function onClose() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    props.onClose();
  }

  useEffect(() => {
    if (stateValue === StateValue.submitSuccess) {
      closeTimeoutRef.current = setTimeout(() => {
        dispatch({
          type: ActionType.CLOSE,
        });
      }, CLOSE_TIMEOUT_MS);

      // if form was previously submitted and now resubmitted, then we need to
      // clear timer.
    } else if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, [stateValue]);

  useEffect(() => {
    if (effects.length) {
      (async function() {
        for (const { func, args } of effects) {
          await func(args);
        }
      })();
    }
  }, [effects]);

  return (
    <AppModal
      id={domPrefix}
      open={stateValue !== StateValue.closed}
      onUnmount={onClose}
      closeOnDimmerClick={false}
      className={makeClassNames(domPrefix, {
        [domPrefixSubmittingClass]: stateValue === StateValue.submitting,
        [domPrefixSuccessClass]: stateValue === StateValue.submitSuccess,
      })}
    >
      {stateValue === StateValue.submitting && (
        <SubmittingOverlay id={domSubmittingOverlayId} parentId={domPrefix} />
      )}

      <Modal.Header>{uiTexts.updateResume}</Modal.Header>

      {stateValue === StateValue.submitSuccess && (
        <Message success={true} id={domSubmitSuccessId}>
          <Message.Header>{uiTexts.updateSuccessMessage}</Message.Header>

          <Message.Content
            style={{
              fontSize: "0.95rem",
            }}
          >
            <div
              style={{
                marginBottom: "10px",
              }}
            >
              You will be redirected in {CLOSE_TIMEOUT_MS / 1000} secs.
            </div>

            <div>Or you may use the close button to return to login.</div>
          </Message.Content>
        </Message>
      )}

      {stateMachine.value === StateValue.serverErrors && (
        <Message error={true} id={domSubmitServerErrorsId}>
          <Message.Header>Errors occurred</Message.Header>

          {stateMachine.serverErrors.value === "nonFieldError" && (
            <Message.Content id={domSubmitServerErrorTextId}>
              {stateMachine.serverErrors.nonFieldError.context.error}
            </Message.Content>
          )}
        </Message>
      )}

      <Modal.Content scrolling={true}>
        <Modal.Description>
          <Form>
            <Form.Field
              id={domTitleFieldId}
              className={makeClassNames({
                [domFieldSuccessClass]:
                  formFields.title.validity.value === "valid",
              })}
              error={formFields.title.validity.value === "invalid"}
            >
              <label htmlFor={domTitleInputId}>{uiTexts.form.title}</label>

              <Input
                id={domTitleInputId}
                value={formState.context.title}
                onChange={(_, { value }) => {
                  dispatch({
                    type: ActionType.FORM_CHANGED,
                    value,
                    fieldName: "title",
                  });
                }}
                onBlur={() => {
                  dispatch({
                    type: ActionType.FORM_FIELD_BLURRED,
                    fieldName: "title",
                  });
                }}
              />

              {formFields.title.validity.value === "invalid" && (
                <FormCtrlError id={domTitleErrorId}>
                  {formFields.title.validity.invalid.context.error}
                </FormCtrlError>
              )}
            </Form.Field>
          </Form>

          <Form.Field
            id={domDescriptionFieldId}
            className={makeClassNames({
              [domFieldSuccessClass]:
                formFields.description.validity.value === "valid",
            })}
            error={formFields.description.validity.value === "invalid"}
          >
            <label htmlFor={domDescriptionInputId}>
              {uiTexts.form.description}
              <span style={{ opacity: 0.6 }}> (optional)</span>
            </label>

            <AutoTextarea
              id={domDescriptionInputId}
              name="description"
              onTextChanged={(value: string) => {
                dispatch({
                  type: ActionType.FORM_CHANGED,
                  value,
                  fieldName: "description",
                });
              }}
              onBlur={() => {
                dispatch({
                  type: ActionType.FORM_FIELD_BLURRED,
                  fieldName: "description",
                });
              }}
              value={formState.context.description}
              hiddenStyles={{ maxHeight: "400px" } as React.CSSProperties}
            />

            {formFields.description.validity.value === "invalid" && (
              <FormCtrlError id={domDescriptionErrorId}>
                {formFields.description.validity.invalid.context.error}
              </FormCtrlError>
            )}
          </Form.Field>
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button
          type="button"
          id={domCloseModalBtnId}
          negative={true}
          icon="remove"
          labelPosition="right"
          content={uiTexts.form.closeModalBtnText}
          onClick={() => {
            dispatch({
              type: ActionType.CLOSE,
            });
          }}
        />
        <Button
          id={domSubmitBtnId}
          type="button"
          positive={true}
          icon="checkmark"
          labelPosition="right"
          content={uiTexts.form.submitBtnText}
          onClick={async () => {
            dispatch({
              type: ActionType.SUBMITTING,
              dispatch,
            });
          }}
        />
      </Modal.Actions>
    </AppModal>
  );
}
