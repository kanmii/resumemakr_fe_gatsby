/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateResumeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateResume
// ====================================================

export interface CreateResume_createResume_resume_additionalSkills {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface CreateResume_createResume_resume_languages {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface CreateResume_createResume_resume_personalInfo {
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

export interface CreateResume_createResume_resume_experiences {
  __typename: "Experience";
  id: string;
  index: number;
  achievements: (string | null)[] | null;
  companyName: string | null;
  fromDate: string | null;
  position: string | null;
  toDate: string | null;
}

export interface CreateResume_createResume_resume_skills {
  __typename: "Skill";
  id: string;
  index: number;
  description: string | null;
  achievements: (string | null)[] | null;
}

export interface CreateResume_createResume_resume_education {
  __typename: "Education";
  id: string;
  index: number;
  course: string | null;
  fromDate: string | null;
  toDate: string | null;
  school: string | null;
  achievements: (string | null)[] | null;
}

export interface CreateResume_createResume_resume {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
  hobbies: (string | null)[] | null;
  additionalSkills: (CreateResume_createResume_resume_additionalSkills | null)[] | null;
  languages: (CreateResume_createResume_resume_languages | null)[] | null;
  personalInfo: CreateResume_createResume_resume_personalInfo | null;
  experiences: (CreateResume_createResume_resume_experiences | null)[] | null;
  skills: (CreateResume_createResume_resume_skills | null)[] | null;
  education: (CreateResume_createResume_resume_education | null)[] | null;
}

export interface CreateResume_createResume {
  __typename: "CreateResumePayload";
  resume: CreateResume_createResume_resume | null;
}

export interface CreateResume {
  createResume: CreateResume_createResume | null;
}

export interface CreateResumeVariables {
  input: CreateResumeInput;
}
