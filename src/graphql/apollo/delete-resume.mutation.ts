import gql from "graphql-tag";
import { MutationFunction, graphql } from "react-apollo";
import { DeleteResume, DeleteResumeVariables } from "../apollo-types/DeleteResume";

export const deleteResumeMutation = gql`
  mutation DeleteResume($input: DeleteResumeInput!) {
    deleteResume(input: $input) {
      resume {
        id
        title
      }
    }
  }
`;

export default deleteResumeMutation;

export type DeleteResumeMutationFn = MutationFunction<
  DeleteResume,
  DeleteResumeVariables
>;

export interface DeleteResumeProps {
  deleteResume?: DeleteResumeMutationFn;
}

export const deleteResumeGql = graphql<
  {},
  DeleteResume,
  DeleteResumeVariables,
  DeleteResumeProps | void
>(deleteResumeMutation, {
  props: ({ mutate }) => {
    if (!mutate) {
      return undefined;
    }

    return {
      deleteResume: mutate,
    };
  },
});
