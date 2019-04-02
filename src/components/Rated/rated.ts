import * as Yup from "yup";

import { RatedInput } from "../../graphql/apollo/types/globalTypes";

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
