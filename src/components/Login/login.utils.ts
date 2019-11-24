import * as Yup from "yup";
import { RouteComponentProps } from "@reach/router";
import { LoginInput as FormValues } from "../../graphql/apollo-types/globalTypes";
import {
  emailValidationSchema,
  passwordValidationSchema,
} from "../components.utils";
import { Reducer } from "react";
import { wrapReducer } from "../../logger";
import immer from "immer";
import { ResetPasswordSimpleGraphqlProps } from "../../graphql/apollo/reset-password.mutation";

export const ValidationSchema = Yup.object<FormValues>().shape({
  email: emailValidationSchema,
  password: passwordValidationSchema,
});

export enum ActionTypes {
  SET_OTHER_ERRORS = "@login/SET_OTHER_ERRORS",
  SET_FORM_ERROR = "@login/SET_FORM_ERROR",
  SET_GRAPHQL_ERROR = "@login/SET_GRAPHQL_ERROR",
  TRIGGER_PASSWORD_RESET_UI = "@login/trigger-password-reset-ui",
  PASSWORD_RESET_UI_CLOSED = "@login/password-reset-ui-destroyed",
}

export const reducer: Reducer<StateMachine, Action> = (state, action) =>
  wrapReducer(state, action, (prevState, { type }) => {
    return immer(prevState, proxy => {
      switch (type) {
        case ActionTypes.TRIGGER_PASSWORD_RESET_UI:
          {
            proxy.value = "resetpassword";
          }

          break;

        case ActionTypes.PASSWORD_RESET_UI_CLOSED:
          {
            proxy.value = "idle";
          }

          break;
      }
    });
  });

export function initiState(): StateMachine {
  return {
    value: "idle",
  };
}

export const RouterThings = {
  documentTitle: "Log in",
};

export type StateMachine =
  | {
      value: "resetpassword";
    }
  | {
      value: "idle";
    };

export type Action =
  | {
      type: ActionTypes.TRIGGER_PASSWORD_RESET_UI;
    }
  | {
      type: ActionTypes.PASSWORD_RESET_UI_CLOSED;
    };

export type Props = RouteComponentProps & ResetPasswordSimpleGraphqlProps;
