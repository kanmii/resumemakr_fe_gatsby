import gql from "graphql-tag";
import { MutationFunction, MutationOptions } from "react-apollo";
import { resumeFullFrag } from "./resume_full.fragment";
import { CreateResume, CreateResumeVariables } from "../apollo-types/CreateResume";

export const createResume = gql`
  mutation CreateResume($input: CreateResumeInput!) {
    createResume(input: $input) {
      resume {
        ...ResumeFullFrag
      }
    }
  }

  ${resumeFullFrag}
`;

export default createResume;

export type ErstellenLebenslaufFnArgs = MutationOptions<
  CreateResume,
  CreateResumeVariables
>;

export type CreateResumeFn = MutationFunction<CreateResume, CreateResumeVariables>;

export interface CreateResumeProps {
  createResume?: CreateResumeFn;
}
