import React, { useRef, useReducer } from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import {
  Formik,
  FastField,
  FieldProps,
  FormikProps,
  FormikErrors,
} from "formik";
import loIsEmpty from "lodash/isEmpty";
import { ApolloError } from "apollo-client";
import {
  initialFormValues,
  AuthFormValidationSchema,
  FormValuesKey,
  FORM_RENDER_PROPS,
  uiTexts,
  reducer,
  ActionTypes,
  DispatchType,
} from "./signup.utils";
import { RegistrationInput } from "../../graphql/apollo-types/globalTypes";
import { LOGIN_URL } from "../../routing";
import { refreshToMyResumes } from "../../utils/refresh-to-my-resumes";
import { isConnected } from "../../state/get-conn-status";
import { noOp } from "../../constants";
import { clearToken } from "../../state/tokens";
import { AuthCard } from "../AuthCard";
import { OtherAuthLink } from "../OtherAuthLink";
import { RegUserFn } from "../../graphql/apollo/user-reg.mutation";
import { scrollToTop } from "./scroll-to-top";
import { domSubmitBtnId, domErrorsId } from "./signup.dom-selectors";
import { useUserRegistrationMutation } from "./signup.injectables";
import { useUserLocalMutation } from "../../state/user.local.mutation";

export function SignUp() {
  const [regUser] = useUserRegistrationMutation();
  const [updateLocalUser] = useUserLocalMutation();

  const [state, dispatch] = useReducer(reducer, {});
  const { otherErrors, formErrors, gqlFehler } = state;

  const mainRef = useRef<HTMLDivElement>(null);

  function onSubmit(formProps: FormikProps<RegistrationInput>) {
    return async function() {
      const { validateForm, values, setSubmitting } = formProps;

      clearToken();
      setSubmitting(true);
      dispatch({
        type: ActionTypes.reset_all_errors,
      });

      const errors = await validateForm(values);

      if (!loIsEmpty(errors)) {
        setSubmitting(false);
        dispatch({ type: ActionTypes.set_form_errors, payload: errors });
        scrollToTop(mainRef);
        return;
      }

      if (!(await isConnected())) {
        setSubmitting(false);
        dispatch({
          type: ActionTypes.set_other_errors,
          payload: "You are not connected",
        });
        scrollToTop(mainRef);
        return;
      }

      try {
        const result = await (regUser as RegUserFn)({
          variables: { input: values },
        });

        const user =
          result &&
          result.data &&
          result.data.registration &&
          result.data.registration.user;

        if (!user) {
          setSubmitting(false);
          dispatch({
            type: ActionTypes.set_other_errors,
            payload: "Account creation has failed.",
          });
          scrollToTop(mainRef);
          return;
        }

        if (updateLocalUser) {
          await updateLocalUser({ variables: { user } });
        }

        refreshToMyResumes();
      } catch (error) {
        setSubmitting(false);
        dispatch({ type: ActionTypes.set_graphql_errors, payload: error });
        scrollToTop(mainRef);
      }
    };
  }

  function renderForm(formProps: FormikProps<RegistrationInput>) {
    const { dirty, isSubmitting } = formProps;

    return (
      <AuthCard>
        <RenderFormErrors
          otherErrors={otherErrors}
          gqlFehler={gqlFehler}
          formErrors={formErrors}
          dispatch={dispatch}
        />

        <Card.Content style={{ flexShrink: "0" }} extra={true}>
          Sign up to create your resume
        </Card.Content>

        <Card.Content>
          <Form onSubmit={onSubmit(formProps)}>
            {Object.entries(FORM_RENDER_PROPS).map(
              ([name, [label, type, domId]]) => {
                return (
                  <FastField
                    key={name}
                    name={name}
                    render={(
                      formRenderProps: FieldProps<RegistrationInput>,
                    ) => (
                      <RenderInput
                        label={label}
                        type={type}
                        formProps={formRenderProps}
                        id={domId}
                      />
                    )}
                  />
                );
              },
            )}

            <Button
              id={domSubmitBtnId}
              name="sign-up-submit"
              color="green"
              inverted={true}
              disabled={!dirty || isSubmitting}
              loading={isSubmitting}
              type="submit"
              fluid={true}
            >
              <Icon name="checkmark" /> {uiTexts.submitBtn}
            </Button>
          </Form>
        </Card.Content>

        <Card.Content style={{ flexShrink: "0" }} extra={true}>
          <OtherAuthLink
            url={LOGIN_URL}
            isSubmitting={isSubmitting}
            text="Already have an account? Login"
          />
        </Card.Content>
      </AuthCard>
    );
  }

  return (
    <div className="auth-main-app" ref={mainRef}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={noOp}
        render={renderForm}
        validationSchema={AuthFormValidationSchema}
        validateOnChange={false}
      />
    </div>
  );
}

function RenderFormErrors({
  formErrors,
  otherErrors,
  gqlFehler,
  dispatch,
}: {
  formErrors?: FormikErrors<RegistrationInput> | null;
  otherErrors?: string | null;
  gqlFehler?: ApolloError | null;
  dispatch: DispatchType;
}) {
  let content = null;

  if (otherErrors) {
    content = otherErrors;
  }

  if (formErrors) {
    content = (
      <>
        <span>Errors in fields:</span>
        {Object.entries(formErrors).map(([k, err]) => {
          const label = FORM_RENDER_PROPS[k][0];
          return (
            <div key={label}>
              <div className="error-label">{label}</div>
              <div className="error-text">{err}</div>
            </div>
          );
        })}
      </>
    );
  }

  if (gqlFehler) {
    const errors: {
      [k: string]: string;
    }[] = gqlFehler.graphQLErrors.map(
      ({ message }) => JSON.parse(message).errors,
    );

    content = errors.map(err => {
      const [[k, v]] = Object.entries(err);

      return (
        <div key={k}>
          {k.charAt(0).toUpperCase() + k.slice(1)}: {v}
        </div>
      );
    });
  }

  if (content) {
    return (
      <Card.Content
        id={domErrorsId}
        extra={true}
        data-testid={uiTexts.formErrorTestId}
      >
        <Message
          error={true}
          onDismiss={() => {
            dispatch({
              type: ActionTypes.reset_all_errors,
            });
          }}
        >
          <Message.Content>{content}</Message.Content>
        </Message>
      </Card.Content>
    );
  }

  return null;
}

function RenderInput({
  label,
  type,
  formProps,
  id,
}: {
  label: string;
  type: string;
  formProps: FieldProps<RegistrationInput>;
  id: string;
}) {
  const { field } = formProps;
  const name = field.name as FormValuesKey;
  const isSourceField = name === "source";

  return (
    <Form.Field
      {...field}
      className={`form-field ${isSourceField ? "disabled" : ""}`}
      type={type}
      control={Input}
      autoComplete="off"
      label={label}
      id={id}
      readOnly={isSourceField}
      tabIndex={isSourceField ? -1 : 0}
    />
  );
}
