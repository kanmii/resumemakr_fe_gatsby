import gql from "graphql-tag";
import { useMutation, MutationFunction } from "react-apollo";
import { resumeFullFrag } from "./resume_full.fragment";
import {
  UpdateResume,
  UpdateResumeVariables,
} from "../apollo-types/UpdateResume";

export const UPDATE_RESUME_MUTATION = gql`
  mutation UpdateResume($input: UpdateResumeInput!) {
    updateResume(input: $input) {
      resume {
        ...ResumeFullFrag
      }
    }
  }

  ${resumeFullFrag}
`;

export function useUpdateResumeMutation() {
  return useMutation<UpdateResume, UpdateResumeVariables>(
    UPDATE_RESUME_MUTATION,
  );
}

export type UpdateResumeMutationFn = MutationFunction<
  UpdateResume,
  UpdateResumeVariables
>;
