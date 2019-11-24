import React, { useReducer, useEffect } from "react";
import Input from "semantic-ui-react/dist/commonjs/elements/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import {
  domEmailInputId,
  domPasswordInputId,
  domPasswordConfirmationInputId,
  domSubmitBtn,
  domSubmittingOverlay,
  domSubmitSuccess,
  domModalClass,
  domFormId,
  domFormFieldSuccessClass,
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

export function ResetPassword(props: Props) {
  const [stateMachine, dispatch] = useReducer(reducer, props, initiState);
  const formState = (stateMachine as Editable).editable.form;
  const formFields = formState.fields;
  const stateValue = stateMachine.value;
  const [resetPassword] = props.useResetPasswordSimple;

  useEffect(() => {
    if (stateValue === "submitSuccess") {
      setTimeout(() => {
        dispatch({
          type: ActionTypes.DESTROY,
        });
      }, 5000);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [stateValue]);

  return (
    <Modal
      dimmer="inverted"
      style={{
        maxWidth: "400px",
      }}
      open={stateValue !== "destroyed"}
      closeOnDimmerClick={false}
      closeIcon={true}
      onClose={() => {
        dispatch({
          type: ActionTypes.DESTROY,
        });
      }}
      onUnmount={props.onClose}
      className={domModalClass}
    >
      <Header as="h3" content="Reset Password" />

      <Modal.Content>
        {stateValue === "submitting" && <div id={domSubmittingOverlay} />}
        {stateValue === "submitSuccess" && <div id={domSubmitSuccess} />}

        <Form
          success={formState.validity.value === "valid"}
          id={domFormId}
          onSubmit={async () => {
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
              disabled={formState.validity.value === "invalid"}
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
