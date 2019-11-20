import gql from "graphql-tag";
import { MutationFunction, MutationOptions } from "react-apollo";
import { RESUME_FULL_FRAGMENT } from "./resume_full.fragment";
import { CloneResume, CloneResumeVariables } from "../apollo-types/CloneResume";

export const cloneResume = gql`
  mutation CloneResume($input: CloneResumeInput!) {
    cloneResume(input: $input) {
      resume {
        ...ResumeFullFrag
      }
    }
  }

  ${RESUME_FULL_FRAGMENT}
`;

export default cloneResume;

export type CloneResumeFn = MutationFunction<CloneResume, CloneResumeVariables>;

export interface CloneResumeProps {
  cloneResume?: CloneResumeFn;
}

export type CloneLebensLaufFnArgs = MutationOptions<
  CloneResume,
  CloneResumeVariables
>;
