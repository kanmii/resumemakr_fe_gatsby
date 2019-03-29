/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResumeTitles
// ====================================================

export interface ResumeTitles_listResumes_edges_node {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
  updatedAt: any;
}

export interface ResumeTitles_listResumes_edges {
  __typename: "ResumeEdge";
  /**
   * The item at the end of the edge
   */
  node: ResumeTitles_listResumes_edges_node | null;
}

export interface ResumeTitles_listResumes {
  __typename: "ResumeConnection";
  edges: (ResumeTitles_listResumes_edges | null)[] | null;
}

export interface ResumeTitles {
  /**
   * query a resume
   */
  listResumes: ResumeTitles_listResumes | null;
}

export interface ResumeTitlesVariables {
  howMany: number;
}
