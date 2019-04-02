import * as Yup from "yup";

import { EducationInput } from "../../graphql/apollo/types/globalTypes";

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
