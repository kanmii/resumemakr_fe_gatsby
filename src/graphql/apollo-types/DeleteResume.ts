/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteResumeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteResume
// ====================================================

export interface DeleteResume_deleteResume_resume {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
}

export interface DeleteResume_deleteResume {
  __typename: "DeleteResumePayload";
  resume: DeleteResume_deleteResume_resume | null;
}

export interface DeleteResume {
  /**
   * Delete a resume
   */
  deleteResume: DeleteResume_deleteResume | null;
}

export interface DeleteResumeVariables {
  input: DeleteResumeInput;
}
