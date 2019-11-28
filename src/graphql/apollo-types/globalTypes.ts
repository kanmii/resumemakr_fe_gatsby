/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface CloneResumeInput {
  description?: string | null;
  id: string;
  title?: string | null;
}

/**
 * Variables for creating resume experience
 */
export interface CreateExperienceInput {
  achievements?: (string | null)[] | null;
  companyName?: string | null;
  fromDate?: string | null;
  id?: string | null;
  index: number;
  position?: string | null;
  toDate?: string | null;
}

export interface CreateResumeInput {
  additionalSkills?: (RatedInput | null)[] | null;
  description?: string | null;
  education?: (EducationInput | null)[] | null;
  experiences?: (CreateExperienceInput | null)[] | null;
  hobbies?: (string | null)[] | null;
  languages?: (RatedInput | null)[] | null;
  personalInfo?: PersonalInfoInput | null;
  skills?: (CreateSkillInput | null)[] | null;
  title: string;
}

/**
 * A resume skill
 */
export interface CreateSkillInput {
  achievements?: (string | null)[] | null;
  description?: string | null;
  id?: string | null;
  index: number;
}

export interface DeleteResumeInput {
  id: string;
}

/**
 * Variables for creating resume education
 */
export interface EducationInput {
  achievements?: (string | null)[] | null;
  course?: string | null;
  fromDate?: string | null;
  id?: string | null;
  index: number;
  school?: string | null;
  toDate?: string | null;
}

/**
 * Variables for getting a Resume
 */
export interface GetResumeInput {
  id?: string | null;
  title?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Variables for creating Personal Info
 */
export interface PersonalInfoInput {
  address?: string | null;
  dateOfBirth?: string | null;
  email?: string | null;
  firstName?: string | null;
  id?: string | null;
  lastName?: string | null;
  phone?: string | null;
  photo?: any | null;
  profession?: string | null;
}

/**
 * Variables for creating an object with a rating
 */
export interface RatedInput {
  description?: string | null;
  id?: string | null;
  index: number;
  level?: string | null;
}

export interface RegistrationInput {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  source: string;
}

export interface ResetPasswordInput {
  password: string;
  passwordConfirmation: string;
  token: string;
}

export interface ResetPasswordSimpleInput {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateResumeInput {
  additionalSkills?: (RatedInput | null)[] | null;
  description?: string | null;
  education?: (EducationInput | null)[] | null;
  experiences?: (CreateExperienceInput | null)[] | null;
  hobbies?: (string | null)[] | null;
  id: string;
  languages?: (RatedInput | null)[] | null;
  personalInfo?: PersonalInfoInput | null;
  skills?: (CreateSkillInput | null)[] | null;
  title?: string | null;
}

/**
 * variables for updating minimal attributes of resume.
 */
export interface UpdateResumeMinimalInput {
  description?: string | null;
  id: string;
  title?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
