import gql from "graphql-tag";
import { DataValue } from "react-apollo";
import { resumeFullFrag } from "./resume_full.fragment";
import { GetResume, GetResumeVariables } from "../apollo-types/GetResume";

export const GET_RESUME_QUERY = gql`
  query GetResume($input: GetResumeInput!) {
    getResume(input: $input) {
      ...ResumeFullFrag
    }
  }

  ${resumeFullFrag}
`;

export type GetResumeProps = DataValue<GetResume, GetResumeVariables>;
