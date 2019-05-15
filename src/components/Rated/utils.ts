import * as Yup from "yup";

import { RatedInput } from "../../graphql/apollo/types/globalTypes";
import { Section, ChildProps } from "../UpdateResumeForm/utils";

export const emptyVal: RatedInput = {
  description: "",
  level: "",
  index: 1
};

export const validationSchema = Yup.object<RatedInput>().shape({
  description: Yup.string(),
  level: Yup.string(),
  index: Yup.number()
    .required()
    .min(1)
});

export const additionalSkillDefaultVal: RatedInput = {
  description: "Adobe Photoshop",
  level: "Excellent",
  index: 1
};

export const languageDefaultVal: RatedInput = {
  description: "Spanish",
  level: "C1",
  index: 1
};

export interface RowItemsLabels {
  description: string;
  level: string;
}
export interface Props extends ChildProps {
  label: Section;
  values?: Array<RatedInput | null> | null;
  icon: JSX.Element;
  fieldName: string;
  idPrefix: string;
  rowItemsLabels: RowItemsLabels;
  dataTestId: string;
}

export function makeRatedName(
  fieldName: string,
  index: number,
  key: keyof RatedInput
) {
  return `${fieldName}[${index}].${key}`;
}
