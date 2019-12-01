/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateResumeMinimalInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateResumeMinimal
// ====================================================

export interface UpdateResumeMinimal_updateResumeMinimal_ResumeSuccess_resume {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
}

export interface UpdateResumeMinimal_updateResumeMinimal_ResumeSuccess {
  __typename: "ResumeSuccess";
  resume: UpdateResumeMinimal_updateResumeMinimal_ResumeSuccess_resume | null;
}

export interface UpdateResumeMinimal_updateResumeMinimal_UpdateResumeErrors_errors {
  __typename: "UpdateResumeErrorsFields";
  title: string | null;
  description: string | null;
  error: string | null;
}

export interface UpdateResumeMinimal_updateResumeMinimal_UpdateResumeErrors {
  __typename: "UpdateResumeErrors";
  errors: UpdateResumeMinimal_updateResumeMinimal_UpdateResumeErrors_errors;
}

export type UpdateResumeMinimal_updateResumeMinimal = UpdateResumeMinimal_updateResumeMinimal_ResumeSuccess | UpdateResumeMinimal_updateResumeMinimal_UpdateResumeErrors;

export interface UpdateResumeMinimal {
  /**
   * mutation - minimally update a resume
   */
  updateResumeMinimal: UpdateResumeMinimal_updateResumeMinimal | null;
}

export interface UpdateResumeMinimalVariables {
  input: UpdateResumeMinimalInput;
}
