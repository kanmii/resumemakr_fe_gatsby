import React, { useRef, useReducer, Reducer, Dispatch } from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import {
  Formik,
  FastField,
  FieldProps,
  FormikProps,
  FormikErrors
} from "formik";
import loIsEmpty from "lodash/isEmpty";
import ApolloClient, { ApolloError } from "apollo-client";

import {
  Props,
  initialFormValues,
  ValidationSchema,
  FormValuesKey,
  FORM_RENDER_PROPS,
  uiTexts
} from "./sign-up";
import { RegistrationInput } from "../../graphql/apollo/types/globalTypes";
import { LOGIN_URL } from "../../routing";
import refreshToAppDefault from "../../refresh-to-app";
import getConnDefault, { GetConnStatus } from "../../State/get-conn-status";
import { noOp } from "../../constants";
import { clearToken } from "../../State/tokens";
import { AuthCard } from "../AuthCard";
import { OtherAuthLink } from "../OtherAuthLink";
import { RegUserFn } from "../../graphql/apollo/user-reg.mutation";
import { UserLocalMutationFn } from "../../State/user.local.mutation";

interface State {
  readonly otherErrors?: string | null;
  readonly formErrors?: FormikErrors<RegistrationInput> | null;
  readonly gqlFehler?: ApolloError | null;
}

const reducer: Reducer<State, State> = (state, action) => {
  return { ...state, ...action };
};

export function SignUp(merkmale: Props) {
  const {
    regUser,
    updateLocalUser,
    scrollToTop: scrollToTopFromProps,
    getConn = getConnDefault,
    refreshToHome = refreshToAppDefault,
    client
  } = merkmale;

  /* istanbul ignore next: for test only*/
  const scrollToTop = scrollToTopFromProps || defaultScrollToTop;

  const [state, dispatch] = useReducer(reducer, {});
  const { otherErrors, formErrors, gqlFehler } = state;

  const mainRef = useRef<HTMLDivElement>(null);

  /* istanbul ignore next: */
  function defaultScrollToTop() {
    if (mainRef && mainRef.current) {
      /* istanbul ignore next: */
      mainRef.current.scrollTop = 0;
    }
  }

  function renderForm(props: FormikProps<RegistrationInput>) {
    const { dirty, isSubmitting } = props;

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
          <Form
            onSubmit={onSubmit({
              ...props,
              dispatch,
              refreshToHome,
              regUser,
              scrollToTop,
              updateLocalUser,
              getConn,
              client
            })}
          >
            {Object.entries(FORM_RENDER_PROPS).map(([name, [label, type]]) => {
              return (
                <FastField
                  key={name}
                  name={name}
                  render={(formProps: FieldProps<RegistrationInput>) => (
                    <RenderInput
                      label={label}
                      type={type}
                      formProps={formProps}
                    />
                  )}
                />
              );
            })}

            <Button
              id="sign-up-submit"
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
        validationSchema={ValidationSchema}
        validateOnChange={false}
      />
    </div>
  );
}

export default SignUp;

function RenderFormErrors({
  formErrors,
  otherErrors,
  gqlFehler,
  dispatch
}: {
  formErrors?: FormikErrors<RegistrationInput> | null;
  otherErrors?: string | null;
  gqlFehler?: ApolloError | null;
  dispatch: Dispatch<State>;
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
    const errors: Array<{
      [k: string]: string;
    }> = gqlFehler.graphQLErrors.map(
      ({ message }) => JSON.parse(message).errors
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
      <Card.Content extra={true} data-testid={uiTexts.formErrorTestId}>
        <Message
          error={true}
          onDismiss={() => {
            dispatch({
              otherErrors: null,
              gqlFehler: null,
              formErrors: null
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
  formProps
}: {
  label: string;
  type: string;
  formProps: FieldProps<RegistrationInput>;
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
      id={name}
      autoFocus={name === "name"}
      readOnly={isSourceField}
      tabIndex={isSourceField ? -1 : 0}
    />
  );
}

function onSubmit({
  values,
  setSubmitting,
  validateForm,
  dispatch,
  refreshToHome,
  regUser,
  scrollToTop,
  updateLocalUser,
  getConn,
  client
}: {
  dispatch: Dispatch<State>;
  refreshToHome: () => void;
  regUser?: RegUserFn;
  scrollToTop: () => void;
  updateLocalUser?: UserLocalMutationFn;
  getConn: GetConnStatus;
  client: ApolloClient<{}>;
} & FormikProps<RegistrationInput>) {
  return async function() {
    clearToken();
    setSubmitting(true);
    dispatch({
      otherErrors: null,
      formErrors: null,
      gqlFehler: null
    });

    if (!regUser) {
      setSubmitting(false);
      dispatch({ otherErrors: "Unknown error" });
      scrollToTop();
      return;
    }

    const errors = await validateForm(values);

    if (!loIsEmpty(errors)) {
      setSubmitting(false);
      dispatch({ formErrors: errors });
      scrollToTop();
      return;
    }

    if (!(await getConn(client))) {
      setSubmitting(false);
      dispatch({ otherErrors: "You are not connected" });
      scrollToTop();
      return;
    }

    try {
      const result = await regUser({
        variables: { input: values }
      });

      const user =
        result &&
        result.data &&
        result.data.registration &&
        result.data.registration.user;

      if (!user) {
        setSubmitting(false);
        dispatch({ otherErrors: "Account creation has failed." });
        scrollToTop();
        return;
      }

      if (updateLocalUser) {
        await updateLocalUser({ variables: { user } });
      }

      refreshToHome();
    } catch (error) {
      setSubmitting(false);
      dispatch({ gqlFehler: error });
      scrollToTop();
    }
  };
}
