import { FormFieldState } from "../components.types";
import { ResumeTitlesFrag_edges_node } from "../../graphql/apollo-types/ResumeTitlesFrag";
import { UpdateResumeMinimalProps } from "../../graphql/apollo/update-resume.mutation";

export enum Mode {
  create = "@mode/create",
  update = "@mode/update",
  clone = "@mode/clone",
}

export type StateMachine =
  | {
      value: "submitting";
    }
  | {
      value: "submitSuccess";
    }
  | {
      value: "closed";
    }
  | Editable
  | ServerErrors;

export interface Editable {
  value: "editable";
  editable: {
    form: {
      context: {
        title: string;
        description: string;
      };
      fields: FormState;
      validity: {
        value: "valid" | "invalid";
      };
      mode: ModeState;
    };
  };
}

interface ModeContext {
  context: {
    resume: ResumeTitlesFrag_edges_node;
  };
}

type ModeState =
  | {
      value: "create";
    }
  | UpdateMode
  | CloneMode;

interface UpdateMode {
  value: "update";
  update: ModeContext;
}

interface CloneMode {
  value: "clone";
  clone: ModeContext;
}

interface FormState {
  title: FormFieldState;
  description: FormFieldState;
}

interface ServerErrors {
  value: "serverErrors";
  serverErrors: {
    context: {
      errors: string;
      title: string;
    };
  };
}

export interface OwnProps {
  mode: Mode;
  resume?: ResumeTitlesFrag_edges_node;
}

export type Props = OwnProps & UpdateResumeMinimalProps;
