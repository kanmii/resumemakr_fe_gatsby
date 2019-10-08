/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ResumeTitlesFrag
// ====================================================

export interface ResumeTitlesFrag_edges_node {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
  updatedAt: any;
}

export interface ResumeTitlesFrag_edges {
  __typename: "ResumeEdge";
  /**
   * The item at the end of the edge
   */
  node: ResumeTitlesFrag_edges_node | null;
}

export interface ResumeTitlesFrag {
  __typename: "ResumeConnection";
  edges: (ResumeTitlesFrag_edges | null)[] | null;
}
