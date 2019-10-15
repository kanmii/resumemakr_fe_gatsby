import * as Yup from "yup";
import { EducationInput } from "../../graphql/apollo/types/globalTypes";
import { Section } from "../UpdateResumeForm/update-resume.utils";

export const emptyVal: EducationInput = {
  index: 1,
  school: "",
  course: "",
  fromDate: "",
  toDate: "",
  achievements: []
};

export const defaultVal: EducationInput = {
  index: 1,
  school: "The City College of New York, New York City, NY",
  course: "MS in Computer Science, Distinction",
  fromDate: "02/2013",
  toDate: "03/2015",
  achievements: ["Graduated summer cum laude", "President of student union"]
};

export const validationSchema = Yup.object<EducationInput>().shape({
  school: Yup.string(),
  course: Yup.string(),
  fromDate: Yup.string(),
  toDate: Yup.string(),
  achievements: Yup.array<string>(),
  index: Yup.number()
    .required()
    .min(1)
});

export const eduFieldName = "education";

export function makeEduFieldName(index: number, key: keyof EducationInput) {
  return `${eduFieldName}[${index}].${key}`;
}

export interface Props {
  label: Section;
  values?: Array<EducationInput | null> | null;
}

export const uiTexts = {
  schoolLabel: "School name, location",
  courseLabel: "Major, minor, degree",
  fromDateLabel: "Date from",
  toDateLabel: "Date to",
  achievementsHeader0: "Achievements",
  achievementsHeader1: "(responsibilities, activities)",
  achievementsHiddenLabel: "education-achievement"
};
