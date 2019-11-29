import { CreateResumeInput } from "../../src/graphql/apollo-types/globalTypes";
import {
  CreateResume,
  CreateResumeVariables,
} from "../../src/graphql/apollo-types/CreateResume";
import { CREATE_RESUME_MUTATION } from "../../src/graphql/apollo/create-resume.mutation";
import { ResumeFullFrag } from "../../src/graphql/apollo-types/ResumeFullFrag";

export const CREATE_RESUME_MINIMAL_DATA: CreateResumeInput = {
  title: "Resume 1",
  description: "Resume 1 description",
};

export function createResume(
  input: CreateResumeInput = CREATE_RESUME_MINIMAL_DATA,
) {
  return cy
    .mutate<CreateResume, CreateResumeVariables>({
      mutation: CREATE_RESUME_MUTATION,
      variables: {
        input,
      },
    })
    .then(({ data }) => {
      const resume = data && data.createResume && data.createResume.resume;
      return resume as ResumeFullFrag;
    });
}
