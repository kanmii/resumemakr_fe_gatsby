/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { GetResumeInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetResume
// ====================================================

export interface GetResume_getResume_additionalSkills {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface GetResume_getResume_languages {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface GetResume_getResume_personalInfo {
  __typename: "PersonalInfo";
  id: string;
  address: string | null;
  dateOfBirth: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  photo: string | null;
  profession: string | null;
}

export interface GetResume_getResume_experiences {
  __typename: "Experience";
  id: string;
  index: number;
  achievements: (string | null)[] | null;
  companyName: string | null;
  fromDate: string | null;
  position: string | null;
  toDate: string | null;
}

export interface GetResume_getResume_skills {
  __typename: "Skill";
  id: string;
  index: number;
  description: string | null;
  achievements: (string | null)[] | null;
}

export interface GetResume_getResume_education {
  __typename: "Education";
  id: string;
  index: number;
  course: string | null;
  fromDate: string | null;
  toDate: string | null;
  school: string | null;
  achievements: (string | null)[] | null;
}

export interface GetResume_getResume {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
  hobbies: (string | null)[] | null;
  additionalSkills: (GetResume_getResume_additionalSkills | null)[] | null;
  languages: (GetResume_getResume_languages | null)[] | null;
  personalInfo: GetResume_getResume_personalInfo | null;
  experiences: (GetResume_getResume_experiences | null)[] | null;
  skills: (GetResume_getResume_skills | null)[] | null;
  education: (GetResume_getResume_education | null)[] | null;
}

export interface GetResume {
  /**
   * Get a resume
   */
  getResume: GetResume_getResume | null;
}

export interface GetResumeVariables {
  input: GetResumeInput;
}
