import React, { useReducer, useEffect, useRef } from "react";
import Input from "semantic-ui-react/dist/commonjs/elements/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import Message from "semantic-ui-react/dist/commonjs/collections/Message";
import {
  domEmailInputId,
  domPasswordInputId,
  domPasswordConfirmationInputId,
  domSubmitBtnId,
  domSubmittingOverlayId,
  domSubmitSuccessId,
  domFormId,
  domFormFieldSuccessClass,
  domPrefix,
  domPrefixSubmittingClass,
  domPrefixSuccessClass,
  domEmailErrorId,
  domPasswordErrorId,
  domPasswordConfirmationErrorId,
  domSubmitServerErrorsId,
} from "./reset-password.dom-selectors";
import {
  Props,
  initiState,
  reducer,
  Editable,
  ActionTypes,
} from "./reset-password.utils";
import "./reset-password.styles.scss";
import makeClassNames from "classnames";
import { Loading } from "../Loading/loading.component";
import { FormCtrlError } from "../FormCtrlError/form-ctrl-error.component";

const CLOSE_TIMEOUT_MS = 50000;

export function ResetPassword(props: Props) {
  const [stateMachine, dispatch] = useReducer(reducer, props, initiState);
  const formState = (stateMachine as Editable).editable.form;
  const formFields = formState.fields;
  const stateValue = stateMachine.value;
  const [resetPassword] = props.useResetPasswordSimple;
  const closeTimeoutRef = useRef<null | NodeJS.Timeout>(null);

  function onClose() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    props.onClose();
  }

  useEffect(() => {
    if (stateValue === "submitSuccess") {
      closeTimeoutRef.current = setTimeout(() => {
        dispatch({
          type: ActionTypes.CLOSE,
        });
      }, CLOSE_TIMEOUT_MS);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [stateValue]);

  return (
    <Modal
      id={domPrefix}
      dimmer="inverted"
      open={stateValue !== "destroyed"}
      closeOnDimmerClick={false}
      closeIcon={true}
      onClose={() => {
        dispatch({
          type: ActionTypes.CLOSE,
        });
      }}
      onUnmount={onClose}
      className={makeClassNames(domPrefix, {
        [domPrefixSubmittingClass]: stateValue === "submitting",
        [domPrefixSuccessClass]: stateValue === "submitSuccess",
      })}
    >
      {stateValue === "submitting" && (
        <div id={domSubmittingOverlayId} className={domSubmittingOverlayId}>
          <Loading />
        </div>
      )}

      <Header as="h3" content="Reset Password" />

      <Modal.Content>
        {stateValue === "submitSuccess" && (
          <Message success={true} id={domSubmitSuccessId}>
            <Message.Header>Password changed successfully</Message.Header>

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
                You will be directed to login in {CLOSE_TIMEOUT_MS / 1000} secs.
              </div>

              <div>Or you may use the close button to return to login.</div>
            </Message.Content>
          </Message>
        )}

        {stateMachine.value === "serverErrors" && (
          <Message error={true} id={domSubmitServerErrorsId}>
            <Message.Header>Errors occurred</Message.Header>

            <Message.Content>
              {stateMachine.serverErrors.context.errors}
            </Message.Content>
          </Message>
        )}

        <Form
          id={domFormId}
          onSubmit={async () => {
            // istanbul ignore next: needs some hacking to simulate in test
            if (formState.validity.value !== "valid") {
              return;
            }

            dispatch({
              type: ActionTypes.SUBMITTING,
            });

            try {
              await resetPassword({
                variables: {
                  input: formState.context,
                },
              });

              dispatch({
                type: ActionTypes.SUBMIT_SUCCESS,
              });
            } catch (error) {
              dispatch({
                type: ActionTypes.SERVER_ERRORS,
                error,
              });
            }
          }}
        >
          <Form.Field
            className={makeClassNames({
              [domFormFieldSuccessClass]:
                formFields.email.validity.value === "valid",
            })}
            error={formFields.email.validity.value === "invalid"}
          >
            <label htmlFor={domEmailInputId}>Email</label>

            <Input
              id={domEmailInputId}
              value={formState.context.email}
              onChange={(_, { value }) => {
                dispatch({
                  type: ActionTypes.FORM_CHANGED,
                  value,
                  fieldName: "email",
                });
              }}
              onBlur={() => {
                dispatch({
                  type: ActionTypes.FORM_FIELD_BLURRED,
                  fieldName: "email",
                });
              }}
            />

            {formFields.email.validity.value === "invalid" && (
              <FormCtrlError id={domEmailErrorId}>
                {formFields.email.validity.invalid.context.error}
              </FormCtrlError>
            )}
          </Form.Field>

          <Form.Field
            className={makeClassNames({
              [domFormFieldSuccessClass]:
                formFields.password.validity.value === "valid",
            })}
            error={formFields.password.validity.value === "invalid"}
          >
            <label htmlFor={domPasswordInputId}>Password</label>

            <Input
              id={domPasswordInputId}
              value={formState.context.password}
              type="password"
              onChange={(_, { value }) => {
                dispatch({
                  type: ActionTypes.FORM_CHANGED,
                  value,
                  fieldName: "password",
                });
              }}
              onBlur={() => {
                dispatch({
                  type: ActionTypes.FORM_FIELD_BLURRED,
                  fieldName: "password",
                });
              }}
            />

            {formFields.password.validity.value === "invalid" && (
              <FormCtrlError id={domPasswordErrorId}>
                {formFields.password.validity.invalid.context.error}
              </FormCtrlError>
            )}
          </Form.Field>

          <Form.Field
            className={makeClassNames({
              [domFormFieldSuccessClass]:
                formFields.passwordConfirmation.validity.value === "valid",
            })}
            error={formFields.passwordConfirmation.validity.value === "invalid"}
          >
            <label htmlFor={domPasswordConfirmationInputId}>
              Password Confirmation
            </label>

            <Input
              id={domPasswordConfirmationInputId}
              type="password"
              value={formState.context.passwordConfirmation}
              onChange={(_, { value }) => {
                dispatch({
                  type: ActionTypes.FORM_CHANGED,
                  value,
                  fieldName: "passwordConfirmation",
                });
              }}
              onBlur={() => {
                dispatch({
                  type: ActionTypes.FORM_FIELD_BLURRED,
                  fieldName: "passwordConfirmation",
                });
              }}
            />

            {formFields.passwordConfirmation.validity.value === "invalid" && (
              <FormCtrlError id={domPasswordConfirmationErrorId}>
                {formFields.passwordConfirmation.validity.invalid.context.error}
              </FormCtrlError>
            )}
          </Form.Field>

          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
            }}
          >
            <Button
              id={domSubmitBtnId}
              type="submit"
              disabled={
                !(
                  stateMachine.value === "editable" &&
                  stateMachine.editable.form.validity.value === "valid"
                )
              }
              color="green"
              inverted={true}
            >
              <Icon name="checkmark" /> Submit
            </Button>
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
}
