/* eslint-disable @typescript-eslint/no-explicit-any*/
import { PropsWithChildren } from "react";

export type GenericComponentProps = any &
  PropsWithChildren<{}> & {
    className?: string;
    id?: string;
    value?: any;
    onChange?: any;
    name?: string;
  };

export type IEnum<T extends object> = T[keyof T];

export interface FormFieldState {
  edit: FormFieldEdit;
  validity: FormFieldValidity;
}

type FormFieldValidity =
  | {
      value: "unvalidated";
    }
  | {
      value: "valid";
    }
  | FormFieldInvalid;

type FormFieldEdit =
  | {
      value: "unchanged";
    }
  | FormFieldEditChanged
  | FormFieldEditChanging;

interface FormFieldEditChanged {
  value: "changed";
}

export interface FormFieldEditChanging {
  value: "changing";
}

export interface FormFieldInvalid {
  value: "invalid";
  invalid: {
    context: {
      error: string;
    };
  };
}
