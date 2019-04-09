import gql from "graphql-tag";
import { MutationFn, graphql } from "react-apollo";

import { resumeFullFrag } from "./resume_full.fragment";
import { UpdateResume, UpdateResumeVariables } from "./types/UpdateResume";

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

export type UpdateResumeMutationFn = MutationFn<
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
