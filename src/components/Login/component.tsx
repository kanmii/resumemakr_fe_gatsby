import React, { useState, useEffect } from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import { ApolloError } from "apollo-client";
import {
  Formik,
  FastField,
  FieldProps,
  FormikProps,
  Field,
  FormikErrors
} from "formik";

import { Props, ValidationSchema } from "./utils";
import { LoginInput } from "../../graphql/apollo/types/globalTypes";
import { PwdInput } from "../PwdInput";
import { AuthCard } from "../AuthCard";
import { refreshToMyResumes } from "../../utils/refresh-to-my-resumes";
import { getConnStatus } from "../../State/get-conn-status";
import { SIGN_UP_URL } from "../../routing";
import { noOp } from "../../constants";
import { clearToken } from "../../State/tokens";
import { OtherAuthLink } from "../OtherAuthLink";
import { Header } from "../Header";
import { LoginMutationFn } from "../../graphql/apollo/login.mutation";

const Errors = React.memo(ErrorsComp, ErrorsDiff);

export function Login(merkmale: Props) {
  const {
    userLocal,
    updateLocalUser,
    loggedOutUser: loggedOutUserProp,
    client,
    login
  } = merkmale;

  /* istanbul ignore next: */
  const loggedOutUser = loggedOutUserProp && loggedOutUserProp.loggedOutUser;
  const user = userLocal && userLocal.user;

  const [graphQlErrors, setGraphQlErrors] = useState<ApolloError | undefined>(
    undefined
  );

  const [otherErrors, setOtherErrors] = useState<undefined | string>(undefined);

  const [formErrors, setFormErrors] = useState<
    undefined | FormikErrors<LoginInput>
  >(undefined);

  useEffect(function logoutUser() {
    if (!user) {
      return;
    }
    if (updateLocalUser) {
      updateLocalUser({
        variables: {
          user: null
        }
      });
    }
  }, []);

  function onSubmit({
    values,
    setSubmitting,
    validateForm
  }: FormikProps<LoginInput>) {
    return async function() {
      clearToken();

      setSubmitting(true);
      handleErrorsDismissed();

      const errors = await validateForm(values);

      if (errors.email || errors.password) {
        setSubmitting(false);
        setFormErrors(errors);
        return;
      }

      if (!(await getConnStatus(client))) {
        setSubmitting(false);
        setOtherErrors("You are not connected");
        return;
      }

      try {
        const result = await (login as LoginMutationFn)({
          variables: {
            input: values
          }
        });

        const resultUser =
          result && result.data && result.data.login && result.data.login.user;

        if (!resultUser) {
          setSubmitting(false);
          setOtherErrors("There is a problem logging you in.");
          return;
        }

        if (updateLocalUser) {
          await updateLocalUser({
            variables: { user: resultUser }
          });
        }

        refreshToMyResumes();
      } catch (error) {
        setSubmitting(false);
        setGraphQlErrors(error);
      }
    };
  }

  function handleErrorsDismissed() {
    setOtherErrors(undefined);
    setFormErrors(undefined);
    setGraphQlErrors(undefined);
  }

  function renderForm(props: FormikProps<LoginInput>) {
    const { dirty, isSubmitting } = props;

    return (
      <AuthCard>
        <Errors
          errors={{ graphQlErrors, otherErrors, formErrors }}
          handleErrorsDismissed={handleErrorsDismissed}
        />

        <Card.Content style={{ flexShrink: "0" }} extra={true}>
          Login to your account
        </Card.Content>

        <Card.Content>
          <Form onSubmit={onSubmit(props)}>
            <FastField name="email" component={EmailInput} />

            <Field name="password" component={PwdInput} />

            <Button
              id="login-submit"
              name="login-submit"
              color="green"
              inverted={true}
              disabled={!dirty || isSubmitting}
              loading={isSubmitting}
              type="submit"
              fluid={true}
            >
              <Icon name="checkmark" /> Submit
            </Button>
          </Form>
        </Card.Content>

        <Card.Content style={{ flexShrink: "0" }} extra={true}>
          <OtherAuthLink
            isSubmitting={isSubmitting}
            url={SIGN_UP_URL}
            text="Don't have an account? Sign Up"
          />
        </Card.Content>
      </AuthCard>
    );
  }

  return (
    <>
      <Header />

      <div className="auth-main-app">
        <Formik
          initialValues={{
            email:
              (user && user.email) ||
              /* istanbul ignore next: */
              (loggedOutUser && loggedOutUser.email) ||
              "",
            password: ""
          }}
          onSubmit={noOp}
          render={renderForm}
          validationSchema={ValidationSchema}
          validateOnChange={false}
        />
      </div>
    </>
  );
}

function EmailInput(props: FieldProps<LoginInput>) {
  const { field } = props;

  return (
    <Form.Field>
      <label htmlFor="email">Email</label>

      <Input
        {...field}
        type="email"
        autoComplete="off"
        autoFocus={true}
        id="email"
      />
    </Form.Field>
  );
}

interface ErrorsProps {
  errors: {
    otherErrors?: string;
    formErrors?: FormikErrors<LoginInput>;
    graphQlErrors?: ApolloError;
  };

  handleErrorsDismissed: () => void;
}

function ErrorsDiff({ errors: p }: ErrorsProps, { errors: n }: ErrorsProps) {
  for (const [k, v] of Object.entries(p)) {
    if (v !== n[k]) {
      return false;
    }
  }

  return true;
}

function ErrorsComp(props: ErrorsProps) {
  const {
    errors: { otherErrors, formErrors, graphQlErrors },
    handleErrorsDismissed
  } = props;

  function messageContent() {
    if (otherErrors) {
      return otherErrors;
    }

    if (formErrors) {
      const { email, password } = formErrors;

      return (
        <>
          <span>Errors in fields: </span>

          {email && (
            <div>
              <span>Email: </span>
              <span>{email}</span>
            </div>
          )}

          {password && (
            <div>
              <span>Password: </span>
              <span>{password}</span>
            </div>
          )}
        </>
      );
    }

    if (graphQlErrors) {
      return graphQlErrors.graphQLErrors[0].message;
    }

    return null;
  }

  const content = messageContent();

  if (!content) {
    return null;
  }

  return (
    <Card.Content data-testid="login-form-error" extra={true}>
      <Message error={true} onDismiss={handleErrorsDismissed}>
        <Message.Content>{content}</Message.Content>
      </Message>
    </Card.Content>
  );
}
