import * as Yup from "yup";
import { RouteComponentProps } from "@reach/router";
import { CreateExperienceInput } from "../../graphql/apollo/types/globalTypes";
import { Section, ChildProps } from "../UpdateResumeForm/update-resume.utils";

export const emptyVal: CreateExperienceInput = {
  position: "",
  companyName: "",
  fromDate: "",
  toDate: "",
  achievements: [""],
  index: 1,
};

export const validationSchema = Yup.object<CreateExperienceInput>().shape({
  position: Yup.string(),
  companyName: Yup.string(),
  fromDate: Yup.string(),
  toDate: Yup.string(),
  achievements: Yup.array<string>(),
  index: Yup.number()
    .required()
    .min(1),
});

export const defaultVal: CreateExperienceInput = {
  position: "IT Manager",
  companyName: "Apple, New York City, NY",
  fromDate: "2015-03-31",
  toDate: "2016-03-05",
  achievements: [
    "Supervised the IT team in creating mobile apps providing the best user experience for Apple's customers all over the world.",

    "Developed, reviewed, and tested innovative and visionary new applications using emerging technologies.",

    "Guided talent that provides technical support and training while working in partnership with the business team.",
  ],
  index: 1,
};

export const uiTexts = {
  positionLabel: "Title/Position/Responsibility",

  companyNameLabel: "Company, department etc.",

  fromDateLabel: "Date from",

  toDateLabel: "Date to (optional)",

  achievementsLabels1: "Achievements",

  achievementsLabels2: "(responsibilities, activities)",
};

export function makeExperienceFieldName(
  index: number,
  key: keyof CreateExperienceInput,
) {
  return `experiences[${index}].${key}`;
}

export interface Props extends RouteComponentProps, ChildProps {
  values: (CreateExperienceInput | null)[] | null | undefined;
  label: Section;
  defaultValues: CreateExperienceInput[];
}
