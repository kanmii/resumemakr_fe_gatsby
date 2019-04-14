import * as Yup from "yup";
import { MatchRenderProps } from "@reach/router";
import { FormikProps } from "formik";
import { WithFormikConfig } from "formik";
import { createContext } from "react";

import {
  validationSchema as expSchema,
  defaultVal as experience
} from "../Experiences/experiences";
import { validationSchema as personalInfoSchema } from "../PersonalInfo/personal-info";
import {
  validationSchema as edSchema,
  defaultVal as education
} from "../Education/education";
import {
  defaultVal as skills,
  validationSchema as skillsSchema
} from "../Skills/skills";
import {
  EducationInput,
  CreateExperienceInput,
  CreateSkillInput,
  RatedInput,
  UpdateResumeInput
} from "../../graphql/apollo/types/globalTypes";
import { GetResume_getResume } from "../../graphql/apollo/types/GetResume";
import {
  validationSchema as ratedSchema,
  languageDefaultVal,
  additionalSkillDefaultVal
} from "../Rated/rated";
import { UpdateResumeProps } from "../../graphql/apollo/update-resume.mutation";
import { GetResumeProps } from "../../graphql/apollo/get-resume.query";
import { stripTypeName, SetFieldValue } from "../utils";
import { ResumePathMatch } from "../../routing";
import { noOp } from "../../constants";

export interface OwnProps extends MatchRenderProps<ResumePathMatch> {
  debounceTime?: number;
}

export type Props = OwnProps &
  UpdateResumeProps &
  GetResumeProps &
  FormikProps<FormValues>;

export type FormValues = Partial<UpdateResumeInput>;

export const initialFormValues: FormValues = {
  experiences: [experience],
  education: [education],
  additionalSkills: [additionalSkillDefaultVal],
  languages: [languageDefaultVal],
  hobbies: ["Swimming"],
  skills
};

export const validationSchema = Yup.object<FormValues>().shape({
  personalInfo: personalInfoSchema,
  experiences: Yup.array<CreateExperienceInput>().of<CreateExperienceInput>(
    expSchema
  ),
  education: Yup.array<EducationInput>().of<EducationInput>(edSchema),
  skills: Yup.array<CreateSkillInput>().of<CreateSkillInput>(skillsSchema),
  additionalSkills: Yup.array<RatedInput>().of<RatedInput>(ratedSchema),
  languages: Yup.array<RatedInput>().of<RatedInput>(ratedSchema),
  hobbies: Yup.array<string>()
});

// sections by string key
export enum Section {
  personalInfo = "personal-information",
  experiences = "experiences",
  education = "education",
  skills = "skill-summary",
  addSkills = "additional-skills",
  langs = "languages",
  hobbies = "hobbies",
  preview = "preview"
}

export function sectionLabelToHeader(section: Section) {
  return section
    .split("-")
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join(" ") as Section;
}

export const [sectionsList, sectionsLen]: [Section[], number] = (function() {
  const keys = Object.values(Section);

  return [keys, keys.length] as [Section[], number];
})();

export const toSection = (current: Section, to: "next" | "prev") => {
  const currentIndex = sectionsList.indexOf(current);
  let lift = 0;

  if (to === "next") {
    lift = 1;
  } else if (to === "prev") {
    lift = currentIndex > 0 ? -1 : 0;
  }

  return sectionsList[(currentIndex + lift) % sectionsLen];
};

export function getInitialValues(
  getResume: GetResume_getResume | undefined | null
): GetResume_getResume {
  const initial = { ...initialFormValues };

  if (!getResume) {
    return initial as GetResume_getResume;
  }

  return Object.entries(getResume).reduce(
    (acc, [k, v]) => {
      const key = k as keyof GetResume_getResume;

      if (!v || k === "__typename") {
        return acc;
      }

      (acc as GetResume_getResume)[key] = stripTypeName(v);
      return acc;
    },
    {} as GetResume_getResume
  );
}

export const formikConfig: WithFormikConfig<Props, FormValues> = {
  handleSubmit: noOp,

  mapPropsToValues: props => {
    const { getResume } = props;

    return getResume as FormValues;
  },

  enableReinitialize: true,

  validateOnChange: false,

  validateOnBlur: false
};

export interface ChildProps {
  setFieldValue: SetFieldValue<CreateExperienceInput>;
}

type ValueChangedFn = () => void;

export interface ResumeFormContextValue {
  updatingResume?: boolean;

  valueChanged: ValueChangedFn;

  prevFormValues: Partial<UpdateResumeInput>;

  setFieldValue: SetFieldValue<CreateExperienceInput>;
}

export const FormContext = createContext<ResumeFormContextValue>(
  {} as ResumeFormContextValue
);
export const FormContextProvider = FormContext.Provider;

export function nextTooltipText(section: Section) {
  return "Next resume section " + section.toLowerCase();
}

export function prevTooltipText(section: Section) {
  return "Previous resume section " + section.toLowerCase();
}

export const uiTexts = {
  partialPreviewResumeTooltipText: "Partial: preview your resume",

  endPreviewResumeTooltipText: "End: preview your resume",

  backToEditorBtnText: "Back to Editor",

  takingTooLongPrefix: "I am deeply sorry. It looks like",

  takingTooLongSuffix:
    "is taking too long to load. I will display it as soon as it arrives.",

  loadingText: "loading...",

  formValuesSameText: "form values are same"
};
