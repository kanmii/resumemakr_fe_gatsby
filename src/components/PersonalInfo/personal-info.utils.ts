import * as Yup from "yup";

import { PersonalInfoInput } from "../../graphql/apollo-types/globalTypes";

export const defaultVal: PersonalInfoInput = {
  firstName: "Adekanmi",
  lastName: "Ademiiju",
  profession: "Full Stack Developer",
  phone: "+4915213839916",
  address: `30 Ortenberger Straße
77654 Offenburg
Germany`,
  email: "maneptha@gmail.com",
  dateOfBirth: "2015-05-06",
  photo: null
};

export const validationSchema = Yup.object<PersonalInfoInput>().shape({
  phone: Yup.string(),
  firstName: Yup.string(),
  lastName: Yup.string(),
  profession: Yup.string(),
  address: Yup.string(),
  email: Yup.string().email(),
  dateOfBirth: Yup.string(),
  photo: Yup.string()
});

export const emptyVal: PersonalInfoInput = {
  firstName: "",
  lastName: "",
  profession: "",
  phone: "",
  photo: null,
  address: "",
  email: "",
  dateOfBirth: ""
};

export const uiTexts = {
  firstNameLabel: "First name",

  lastNameLabel: "Last name",

  professionLabel: "Profession",

  addressLabel: "Address",

  phoneLabel: "Phone",

  emailLabel: "Email",

  dateOfBirthLabel: "Date of birth yyyy-mm-dd"
};
