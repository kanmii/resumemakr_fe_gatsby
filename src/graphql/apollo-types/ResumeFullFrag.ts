/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ResumeFullFrag
// ====================================================

export interface ResumeFullFrag_additionalSkills {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface ResumeFullFrag_languages {
  __typename: "Rated";
  id: string;
  description: string | null;
  level: string | null;
  index: number;
}

export interface ResumeFullFrag_personalInfo {
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

export interface ResumeFullFrag_experiences {
  __typename: "Experience";
  id: string;
  index: number;
  achievements: (string | null)[] | null;
  companyName: string | null;
  fromDate: string | null;
  position: string | null;
  toDate: string | null;
}

export interface ResumeFullFrag_skills {
  __typename: "Skill";
  id: string;
  index: number;
  description: string | null;
  achievements: (string | null)[] | null;
}

export interface ResumeFullFrag_education {
  __typename: "Education";
  id: string;
  index: number;
  course: string | null;
  fromDate: string | null;
  toDate: string | null;
  school: string | null;
  achievements: (string | null)[] | null;
}

export interface ResumeFullFrag {
  __typename: "Resume";
  /**
   * The ID of an object
   */
  id: string;
  title: string;
  description: string | null;
  hobbies: (string | null)[] | null;
  additionalSkills: (ResumeFullFrag_additionalSkills | null)[] | null;
  languages: (ResumeFullFrag_languages | null)[] | null;
  personalInfo: ResumeFullFrag_personalInfo | null;
  experiences: (ResumeFullFrag_experiences | null)[] | null;
  skills: (ResumeFullFrag_skills | null)[] | null;
  education: (ResumeFullFrag_education | null)[] | null;
}
