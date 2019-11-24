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
} from "./reset-password.dom-selectors";
import {
  Props,
  initiState,
  reducer,
  Editable,
  ActionTypes,
} from "./reset-password.utils";

export function ResetPassword(props: Props) {
  const [stateMachine, dispatch] = useReducer(reducer, props, initiState);
  const formState = (stateMachine as Editable).editable.form;
  const formFields = formState.fields;
  const stateValue = stateMachine.value;

  useEffect(() => {
    if (stateValue === "submitSuccess") {
      setTimeout(() => {
        dispatch({
          type: ActionTypes.DESTROY,
        });
      }, 5000);
    }
  }, [stateValue]);

  return (
    <Modal
      open={stateValue !== "destroyed"}
      closeOnDimmerClick={false}
      closeIcon={true}
    >
      <Header icon="archive" content="Password Reset" />

      <Modal.Content>
        {stateValue === "submitting" && <div id={domSubmittingOverlay} />}
        {stateValue === "submitSuccess" && <div id={domSubmitSuccess} />}

        <div>Reset Password</div>

        <Form
          onSubmit={async () => {
            dispatch({
              type: ActionTypes.SUBMITTING,
            });

            await props.resetPasswordSimple({
              variables: {
                input: {
                  email: formFields.email.context.value,
                  password: formFields.password.context.value,
                  passwordConfirmation:
                    formFields.passwordConfirmation.context.value,
                },
              },
            });

            dispatch({
              type: ActionTypes.SUBMIT_SUCCESS,
            });
          }}
        >
          <Form.Field>
            <Input
              id={domEmailInputId}
              value={formFields.email.context.value}
              onChange={(_, { data }) => {
                dispatch({
                  type: ActionTypes.FORM_CHANGED,
                  value: data,
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

          <Form.Field>
            <Input
              id={domPasswordInputId}
              value={formFields.password.context.value}
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

          <Form.Field>
            <Input
              id={domPasswordConfirmationInputId}
              type="password"
              value={formFields.passwordConfirmation.context.value}
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

          <Modal.Actions>
            <Button
              id={domSubmitBtn}
              type="submit"
              disabled={formState.validity.value === "invalid"}
            >
              Submit
              <Icon name="checkmark" /> Submit
            </Button>
          </Modal.Actions>
        </Form>
      </Modal.Content>
    </Modal>
  );
}
