import gql from "graphql-tag";
import { MutationFn, graphql } from "react-apollo";

import { DeleteResume, DeleteResumeVariables } from "./types/DeleteResume";

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

export interface DeleteResumeProps {
  deleteResume?: MutationFn<DeleteResume, DeleteResumeVariables>;
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
      deleteResume: mutate
    };
  }
});
