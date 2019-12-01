import gql from "graphql-tag";
import {
  useMutation,
  MutationFunction,
  MutationFunctionOptions,
  MutationResult,
  ExecutionResult,
} from "react-apollo";
import { resumeFullFrag } from "./resume_full.fragment";
import {
  UpdateResume,
  UpdateResumeVariables,
} from "../apollo-types/UpdateResume";
import {
  UpdateResumeMinimal,
  UpdateResumeMinimalVariables,
} from "../apollo-types/UpdateResumeMinimal";

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

export function useUpdateResumeMutation(): UseUpdateResumeMutation {
  return useMutation(UPDATE_RESUME_MUTATION);
}

export type UpdateResumeMutationFn = MutationFunction<
  UpdateResume,
  UpdateResumeVariables
>;

// used to type check test mock calls
export type UpdateResumeMutationFnOptions = MutationFunctionOptions<
  UpdateResume,
  UpdateResumeVariables
>;

export type UseUpdateResumeMutation = [
  UpdateResumeMutationFn,
  MutationResult<UpdateResume>,
];

const UPDATE_RESUME_MINIMAL_ERRORS_FRAGMENT = gql`
  fragment UpdateResumeErrorsFragment on UpdateResumeErrors {
    errors {
      title
      description
      error
    }
  }
`;

const UPDATE_RESUME_MINIMAL_FRAGMENT = gql`
  fragment UpdateResumeMinimalFragment on ResumeSuccess {
    resume {
      id
      title
      description
    }
  }
`;

export const UPDATE_RESUME_MINIMAL_MUTATION = gql`
  mutation UpdateResumeMinimal($input: UpdateResumeMinimalInput!) {
    updateResumeMinimal(input: $input) {
      ... on ResumeSuccess {
        ...UpdateResumeMinimalFragment
      }

      ... on UpdateResumeErrors {
        ...UpdateResumeErrorsFragment
      }
    }
  }

  ${UPDATE_RESUME_MINIMAL_FRAGMENT}
  ${UPDATE_RESUME_MINIMAL_ERRORS_FRAGMENT}
`;

export function useUpdateResumeMinimalMutation(): UseUpdateResumeMinimalMutation {
  return useMutation(UPDATE_RESUME_MINIMAL_MUTATION);
}

export type UpdateResumeMinimalMutationFn = MutationFunction<
  UpdateResumeMinimal,
  UpdateResumeMinimalVariables
>;

// used to type check test mock calls
export type UpdateResumeMinimalMutationFnOptions = MutationFunctionOptions<
  UpdateResumeMinimal,
  UpdateResumeMinimalVariables
>;

// in unit test - type check mutation function resolved result
export type UpdateResumeMinimalExecutionResult = ExecutionResult<
  UpdateResumeMinimal
>;

export type UseUpdateResumeMinimalMutation = [
  UpdateResumeMinimalMutationFn,
  MutationResult<UpdateResumeMinimal>,
];

export interface UpdateResumeMinimalProps {
  updateResume: UpdateResumeMinimalMutationFn;
}
