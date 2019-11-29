import gql from "graphql-tag";
import {
  MutationFunction,
  MutationOptions,
  useMutation,
  MutationFunctionOptions,
  MutationResult,
} from "react-apollo";
import { resumeFullFrag } from "./resume_full.fragment";
import { CloneResume, CloneResumeVariables } from "../apollo-types/CloneResume";

export const CLONE_RESUME_MUTATION = gql`
  mutation CloneResume($input: CloneResumeInput!) {
    cloneResume(input: $input) {
      resume {
        ...ResumeFullFrag
      }
    }
  }

  ${resumeFullFrag}
`;

export type CloneResumeFn = MutationFunction<CloneResume, CloneResumeVariables>;

export type CloneLebensLaufFnArgs = MutationOptions<
  CloneResume,
  CloneResumeVariables
>;

export function useCloneResumeMutation(): UseCloneResumeMutation {
  return useMutation(CLONE_RESUME_MUTATION);
}

export type CloneResumeMutationFn = MutationFunction<
  CloneResume,
  CloneResumeVariables
>;

// used to type check test mock calls
export type CloneResumeMutationFnOptions = MutationFunctionOptions<
  CloneResume,
  CloneResumeVariables
>;

export type UseCloneResumeMutation = [
  CloneResumeMutationFn,
  MutationResult<CloneResume>,
];

// component's props should extend this
export interface CloneResumeProps {
  cloneResume: CloneResumeMutationFn;
}
