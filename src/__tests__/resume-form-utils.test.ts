import {
  initialFormValues,
  getInitialValues
} from "../components/ResumeForm/resume-form";
import { GetResume_getResume } from "../graphql/apollo/types/GetResume";
// import { defaultVal as educationDefaultVal } from "../components/Education/education";

describe("getInitialValues", () => {
  it("returns initial form value if getResume is falsy", () => {
    expect(getInitialValues(null)).toMatchObject(initialFormValues);
  });

  it("strips __typename", () => {
    const values = {
      __typename: "Resume",
      personalInfo: {
        firstName: "me",
        lastName: "you",
        __typename: "PersonalInfo"
      }
    } as GetResume_getResume;

    expect(getInitialValues(values)).toMatchObject({
      personalInfo: {
        firstName: "me",
        lastName: "you"
      }
    } as GetResume_getResume);
  });

  it("replaces null getResumeValues with undefined", () => {
    const values = {
      education: null
    } as GetResume_getResume;

    expect(values.education).not.toBeUndefined();
    expect(getInitialValues(values).education).toBeUndefined();
  });
});
