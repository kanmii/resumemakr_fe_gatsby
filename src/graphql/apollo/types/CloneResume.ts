/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CloneResumeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CloneResume
// ====================================================

export interface CloneResume_cloneResume_resume_additionalSkills {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface CloneResume_cloneResume_resume_languages {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface CloneResume_cloneResume_resume_personalInfo {
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

export interface CloneResume_cloneResume_resume_experiences {
  __typename: "Experience";
  id: string;
  index: number;
  achievements: (string | null)[] | null;
  companyName: string | null;
  fromDate: string | null;
  position: string | null;
  toDate: string | null;
}

export interface CloneResume_cloneResume_resume_skills {
  __typename: "Skill";
  id: string;
  index: number;
  description: string | null;
  achievements: (string | null)[] | null;
}

export interface CloneResume_cloneResume_resume_education {
  __typename: "Education";
  id: string;
  index: number;
  course: string | null;
  fromDate: string | null;
  toDate: string | null;
  school: string | null;
  achievements: (string | null)[] | null;
}

export interface CloneResume_cloneResume_resume {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
  hobbies: (string | null)[] | null;
  additionalSkills: (CloneResume_cloneResume_resume_additionalSkills | null)[] | null;
  languages: (CloneResume_cloneResume_resume_languages | null)[] | null;
  personalInfo: CloneResume_cloneResume_resume_personalInfo | null;
  experiences: (CloneResume_cloneResume_resume_experiences | null)[] | null;
  skills: (CloneResume_cloneResume_resume_skills | null)[] | null;
  education: (CloneResume_cloneResume_resume_education | null)[] | null;
}

export interface CloneResume_cloneResume {
  __typename: "CloneResumePayload";
  resume: CloneResume_cloneResume_resume | null;
}

export interface CloneResume {
  cloneResume: CloneResume_cloneResume | null;
}

export interface CloneResumeVariables {
  input: CloneResumeInput;
}
