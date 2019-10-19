import gql from "graphql-tag";
import { MutationFunction, graphql } from "react-apollo";
import { resumeFullFrag } from "./resume_full.fragment";
import { UpdateResume, UpdateResumeVariables } from "../apollo-types/UpdateResume";

export const updateResume = gql`
  mutation UpdateResume($input: UpdateResumeInput!) {
    updateResume(input: $input) {
      resume {
        ...ResumeFullFrag
      }
    }
  }

  ${resumeFullFrag}
`;

export default updateResume;

export type UpdateResumeMutationFn = MutationFunction<
  UpdateResume,
  UpdateResumeVariables
>;

export interface UpdateResumeProps {
  updateResume?: UpdateResumeMutationFn;
}

export const updateResumeGql = graphql<
  {},
  UpdateResume,
  UpdateResumeVariables,
  UpdateResumeProps | void
>(updateResume, {
  props: ({ mutate }) => {
    if (!mutate) {
      return undefined;
    }

    return {
      updateResume: mutate
    };
  }
});
