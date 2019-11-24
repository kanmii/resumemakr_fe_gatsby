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
  domSubmitBtn,
  domSubmittingOverlay,
  domSubmitSuccess,
  domFormId,
  domFormFieldSuccessClass,
  domPrefix,
  domPrefixSubmittingClass,
  domPrefixSuccessClass,
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
        <div id={domSubmittingOverlay} className={domSubmittingOverlay}>
          <Loading />
        </div>
      )}

      <Header as="h3" content="Reset Password" />

      <Modal.Content>
        {stateValue === "submitSuccess" && (
          <Message success={true} id={domSubmitSuccess}>
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

        <Form
          id={domFormId}
          onSubmit={async () => {
            if (formState.validity.value !== "valid") {
              return;
            }

            dispatch({
              type: ActionTypes.SUBMITTING,
            });

            await resetPassword({
              variables: {
                input: {
                  email: formFields.email.edit.context.value,
                  password: formFields.password.edit.context.value,
                  passwordConfirmation:
                    formFields.passwordConfirmation.edit.context.value,
                },
              },
            });

            dispatch({
              type: ActionTypes.SUBMIT_SUCCESS,
            });
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
              value={formFields.email.edit.context.value}
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
              value={formFields.password.edit.context.value}
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
              value={formFields.passwordConfirmation.edit.context.value}
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
          </Form.Field>

          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
            }}
          >
            <Button
              id={domSubmitBtn}
              type="submit"
              disabled={formState.validity.value !== "valid"}
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
