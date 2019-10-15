import gql from "graphql-tag";
import { MutationFn, MutationOptions } from "react-apollo";
import { resumeFullFrag } from "./resume_full.fragment";
import { CloneResume, CloneResumeVariables } from "../apollo-types/CloneResume";

export const cloneResume = gql`
  mutation CloneResume($input: CloneResumeInput!) {
    cloneResume(input: $input) {
      resume {
        ...ResumeFullFrag
      }
    }
  }

  ${resumeFullFrag}
`;

export default cloneResume;

export type CloneResumeFn = MutationFn<CloneResume, CloneResumeVariables>;

export interface CloneResumeProps {
  cloneResume?: CloneResumeFn;
}

export type CloneLebensLaufFnArgs = MutationOptions<
  CloneResume,
  CloneResumeVariables
>;
