import gql from "graphql-tag";
import {
  MutationFunction,
  useMutation,
  MutationFunctionOptions,
  MutationResult,
} from "react-apollo";
import {
  DeleteResume,
  DeleteResumeVariables,
} from "../apollo-types/DeleteResume";

const DELETE_RESUME_MUTATION = gql`
  mutation DeleteResume($input: DeleteResumeInput!) {
    deleteResume(input: $input) {
      resume {
        id
        title
      }
    }
  }
`;

export function useDeleteResumeMutation(): UseDeleteResumeMutation {
  return useMutation(DELETE_RESUME_MUTATION);
}

export type DeleteResumeMutationFn = MutationFunction<
  DeleteResume,
  DeleteResumeVariables
>;

// used to type check test mock calls
export type DeleteResumeMutationFnOptions = MutationFunctionOptions<
  DeleteResume,
  DeleteResumeVariables
>;

export type UseDeleteResumeMutation = [
  DeleteResumeMutationFn,
  MutationResult<DeleteResume>,
];

// component's props should extend this
export interface DeleteResumeProps {
  deleteResume: DeleteResumeMutationFn;
}
