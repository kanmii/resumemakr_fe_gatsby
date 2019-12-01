/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UpdateResumeMinimalFragment
// ====================================================

export interface UpdateResumeMinimalFragment_resume {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
  updatedAt: any;
}

export interface UpdateResumeMinimalFragment {
  __typename: "ResumeSuccess";
  resume: UpdateResumeMinimalFragment_resume;
}
