import React, { useState, useRef } from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import {
  Formik,
  FastField,
  FieldProps,
  FormikProps,
  FormikErrors
} from "formik";
import loIsEmpty from "lodash/isEmpty";
import { ApolloError } from "apollo-client";
import { NavigateFn } from "@reach/router";

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
import {
  BerechtigungKarte,
  BerechtigungHaupanwendung
} from "../../styles/mixins";
import refreshToAppDefault from "../../refresh-to-app";
import getConnDefault from "../../State/get-conn-status";
import { noOp } from "../../constants";
import { clearToken } from "../../State/tokens";

export function SignUp(merkmale: Props) {
  const {
    navigate,
    regUser,
    updateLocalUser,
    scrollToTop: scrollToTopFromProps,
    getConn = getConnDefault,
    refreshToHome = refreshToAppDefault,
    client
  } = merkmale;

  const navigator = navigate as NavigateFn;

  /* istanbul ignore next: for test only*/
  const scrollToTop = scrollToTopFromProps || defaultScrollToTop;

  const [otherErrors, setOtherErrors] = useState<undefined | string>(undefined);

  const [formErrors, setFormErrors] = useState<
    undefined | FormikErrors<RegistrationInput>
  >(undefined);

  const [gqlFehler, setGqlFehler] = useState<undefined | ApolloError>(
    undefined
  );

  const mainRef = useRef<HTMLDivElement>(null);

  /* istanbul ignore next: */
  function defaultScrollToTop() {
    if (mainRef && mainRef.current) {
      /* istanbul ignore next: */
      mainRef.current.scrollTop = 0;
    }
  }

  function onSubmit({
    values,
    setSubmitting,
    validateForm
  }: FormikProps<RegistrationInput>) {
    return async function() {
      clearToken();
      setSubmitting(true);
      handleErrorsDismissed();

      if (!regUser) {
        setSubmitting(false);
        setOtherErrors("Unknown error");
        scrollToTop();
        return;
      }

      const errors = await validateForm(values);

      if (!loIsEmpty(errors)) {
        setSubmitting(false);
        setFormErrors(errors);
        scrollToTop();
        return;
      }

      if (!(await getConn(client))) {
        setSubmitting(false);
        setOtherErrors("You are not connected");
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
          setOtherErrors("Account creation has failed.");
          scrollToTop();
          return;
        }

        if (updateLocalUser) {
          await updateLocalUser({ variables: { user } });
        }

        refreshToHome();
      } catch (error) {
        setSubmitting(false);
        setGqlFehler(error);
        scrollToTop();
      }
    };
  }

  function handleErrorsDismissed() {
    setOtherErrors(undefined);
    setFormErrors(undefined);
    setGqlFehler(undefined);
  }

  function renderFormErrors() {
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
          <Message error={true} onDismiss={handleErrorsDismissed}>
            <Message.Content>{content}</Message.Content>
          </Message>
        </Card.Content>
      );
    }

    return null;
  }

  function renderForm(props: FormikProps<RegistrationInput>) {
    const { dirty, isSubmitting } = props;

    return (
      <BerechtigungKarte>
        {renderFormErrors()}

        <Card.Content style={{ flexShrink: "0" }} extra={true}>
          Sign up to create your resume
        </Card.Content>

        <Card.Content>
          <Form onSubmit={onSubmit(props)}>
            {Object.entries(FORM_RENDER_PROPS).map(([name, [label, type]]) => {
              return (
                <FastField
                  key={name}
                  name={name}
                  render={renderInput(label, type)}
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
          <Button
            className="to-login-button"
            type="button"
            fluid={true}
            onClick={() => navigator(LOGIN_URL)}
            disabled={isSubmitting}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </BerechtigungKarte>
    );
  }

  function renderInput(label: string, type: string) {
    return function(formProps: FieldProps<RegistrationInput>) {
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
    };
  }

  return (
    <BerechtigungHaupanwendung ref={mainRef}>
      <Formik
        initialValues={initialFormValues}
        onSubmit={noOp}
        render={renderForm}
        validationSchema={ValidationSchema}
        validateOnChange={false}
      />
    </BerechtigungHaupanwendung>
  );
}

export default SignUp;
