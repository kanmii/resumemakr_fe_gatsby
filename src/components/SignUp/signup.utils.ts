import * as Yup from "yup";
import { RouteComponentProps } from "@reach/router";
import { ApolloError } from "apollo-client";
import { FormikErrors } from "formik";
import { Reducer } from "react";
import { RegistrationInput } from "../../graphql/apollo-types/globalTypes";
import {
  domPasswordInputId,
  domPasswordConfirmInputId,
  domNameInputId,
  domEmailInputId,
  domSourceInputId,
} from "./signup.dom-selectors";
import {
  PasswordConfirmationValidationSchema,
  emailValidationSchema,
  passwordValidationSchema,
} from "../components.utils";

export interface Props extends RouteComponentProps {
  mainRef: React.RefObject<HTMLDivElement>;
  header?: JSX.Element;
}

export type FormValuesKey = keyof RegistrationInput;

export const initialFormValues: RegistrationInput = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  source: "password",
};

export const AuthFormValidationSchema = Yup.object<RegistrationInput>().shape({
  name: Yup.string()
    .min(2, "must be at least 2 characters")
    .max(50, "is too long!")
    .required("is required"),
  email: emailValidationSchema,
  password: passwordValidationSchema,
  passwordConfirmation: PasswordConfirmationValidationSchema,

  source: Yup.string().default("password"),
});

export const RouterThings = {
  documentTitle: "Sign up",
};

export const FORMULAR_PASSWORT_RENDERN_MERKMALE = {
  password: ["Password", "password", domPasswordInputId],
  passwordConfirmation: [
    "Password Confirmation",
    "password",
    domPasswordConfirmInputId,
  ],
};

export const FORM_RENDER_PROPS = {
  name: ["Name", "text", domNameInputId],
  email: ["Email", "email", domEmailInputId],
  source: ["Source", "text", domSourceInputId],
  ...FORMULAR_PASSWORT_RENDERN_MERKMALE,
};

export const uiTexts = {
  submitBtn: "Sign up for resumemakr",
  formErrorTestId: "sign-up-form-error",
};

export enum ActionTypes {
  reset_all_errors = "@components/signup/reset_all_errors",
  set_other_errors = "@components/signup/set_other_errors",
  set_form_errors = "@components/signup/set_form_errors",
  set_graphql_errors = "@components/signup/set_graphql_errors",
}

interface State {
  readonly otherErrors?: string | null;
  readonly formErrors?: FormikErrors<RegistrationInput> | null;
  readonly gqlFehler?: ApolloError | null;
}

type ReducerPayload =
  | string
  | null
  | FormikErrors<RegistrationInput>
  | ApolloError;

interface ReducerAction {
  type: ActionTypes;
  payload?: ReducerPayload;
}

const reducerFunctionsObject: {
  [k in ActionTypes]: Reducer<State, ReducerPayload>;
} = {
  [ActionTypes.reset_all_errors]: prevState => ({
    ...prevState,
    otherErrors: null,
    formErrors: null,
    gqlFehler: null,
  }),

  [ActionTypes.set_other_errors]: (previousState, payload) => ({
    ...previousState,
    otherErrors: payload as string,
  }),

  [ActionTypes.set_form_errors]: (prevState, payload) => ({
    ...prevState,
    formErrors: payload as FormikErrors<RegistrationInput>,
  }),

  [ActionTypes.set_graphql_errors]: (prevState, payload) => ({
    ...prevState,
    gqlFehler: payload as ApolloError,
  }),
};

export const reducer: Reducer<State, ReducerAction> = (
  prevState,
  { type, payload },
) => {
  const fn = reducerFunctionsObject[type];

  if (fn) {
    return fn(prevState, payload as ReducerPayload);
  }

  // istanbul ignore next: react reducer magic
  return prevState;
};

export type DispatchType = (value: ReducerAction) => void;
