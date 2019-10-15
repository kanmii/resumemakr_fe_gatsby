import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";
import "jest-dom/extend-expect";
import {
  EducationInput,
  CreateExperienceInput,
  PersonalInfoInput,
  CreateSkillInput,
  RatedInput
} from "../graphql/apollo-types/globalTypes";
import { GetResume_getResume } from "../graphql/apollo-types/GetResume";
import { Preview } from "../components/Preview/preview.component";
import { Mode, Props } from "../components/Preview/preview.utils";
import { renderWithRouter, renderWithApollo } from "./test_utils";

const PreviewP = Preview as React.ComponentClass<Partial<Props>>;

it("renders form preview", () => {
  const personalInfoOthers = {
    firstName: "Kanmii",
    lastName: "Ademii",
    email: "a@b.com",
    phone: "010388736633",
    address: "67 Williams Butler street Kings Plaza",
    dateOfBirth: "2015-06-12",
    profession: "IT manager"
  };

  const personalInfo: PersonalInfoInput = {
    ...personalInfoOthers,
    photo: "photo"
  };

  const expOthers = {
    position: "Account Manager",
    companyName: "Union Bank PLC",
    fromDate: "03/2014",
    toDate: "04/2015"
  };

  const experience = {
    ...expOthers,
    achievements: [
      "Took the company to the highest level",
      "Trained 6000 company employees"
    ]
  } as CreateExperienceInput;

  const education = {
    id: "1",
    school: "Community college",
    course: "Psychoanalysis",
    fromDate: "06/2017"
  } as EducationInput;

  const skill = {
    description: "App development",
    achievements: ["Built 1000 apps", "Saved my company money"]
  } as CreateSkillInput;

  const additionalSkill = {
    description: "Adobe photoshop"
  } as RatedInput;

  const hobbies = ["Singing", "Swimming", "dancing"];

  const language = {
    description: "English",
    level: "fluent"
  } as RatedInput;

  const values = {
    personalInfo,
    experiences: [experience],
    education: [education],
    skills: [skill],
    additionalSkills: [additionalSkill],
    hobbies,
    languages: [language]
  } as GetResume_getResume;

  const { Ui: ui } = renderWithRouter(PreviewP);
  const { Ui } = renderWithApollo(ui);

  const { getByText, getByTestId } = render(
    <Ui mode={Mode.download} getResume={values} />
  );

  expect(
    getByTestId(`${personalInfo.firstName} ${personalInfo.lastName} photo`)
  ).toBeInTheDocument();

  for (const exp of Object.values(expOthers)
    .concat(Object.values(language))
    .concat(Object.values(additionalSkill))
    .concat(Object.values(personalInfoOthers))
    .concat(Object.values(education))
    .concat(experience.achievements as string[])
    .concat([skill.description as string])
    .concat(skill.achievements as string[])
    .concat(hobbies)) {
    expect(getByText(new RegExp(exp, "i"))).toBeInTheDocument();
  }

  // debug();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
