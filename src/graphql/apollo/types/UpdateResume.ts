/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateResumeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateResume
// ====================================================

export interface UpdateResume_updateResume_resume_additionalSkills {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface UpdateResume_updateResume_resume_languages {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface UpdateResume_updateResume_resume_personalInfo {
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

export interface UpdateResume_updateResume_resume_experiences {
  __typename: "Experience";
  id: string;
  index: number;
  achievements: (string | null)[] | null;
  companyName: string | null;
  fromDate: string | null;
  position: string | null;
  toDate: string | null;
}

export interface UpdateResume_updateResume_resume_skills {
  __typename: "Skill";
  id: string;
  index: number;
  description: string | null;
  achievements: (string | null)[] | null;
}

export interface UpdateResume_updateResume_resume_education {
  __typename: "Education";
  id: string;
  index: number;
  course: string | null;
  fromDate: string | null;
  toDate: string | null;
  school: string | null;
  achievements: (string | null)[] | null;
}

export interface UpdateResume_updateResume_resume {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
  hobbies: (string | null)[] | null;
  additionalSkills: (UpdateResume_updateResume_resume_additionalSkills | null)[] | null;
  languages: (UpdateResume_updateResume_resume_languages | null)[] | null;
  personalInfo: UpdateResume_updateResume_resume_personalInfo | null;
  experiences: (UpdateResume_updateResume_resume_experiences | null)[] | null;
  skills: (UpdateResume_updateResume_resume_skills | null)[] | null;
  education: (UpdateResume_updateResume_resume_education | null)[] | null;
}

export interface UpdateResume_updateResume {
  __typename: "UpdateResumePayload";
  resume: UpdateResume_updateResume_resume | null;
}

export interface UpdateResume {
  updateResume: UpdateResume_updateResume | null;
}

export interface UpdateResumeVariables {
  input: UpdateResumeInput;
}
