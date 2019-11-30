import gql from "graphql-tag";
import { useQuery, QueryResult } from "react-apollo";
import {
  ResumeTitles,
  ResumeTitlesVariables,
} from "../apollo-types/ResumeTitles";

const RESUME_CONNECTION_FRAGMENT = gql`
  fragment ResumeTitlesFrag on ResumeConnection {
    edges {
      node {
        id
        title
        description
        updatedAt
      }
    }
  }
`;

export const LIST_RESUMES_QUERY = gql`
  query ResumeTitles($howMany: Int!) {
    listResumes(first: $howMany) {
      ...ResumeTitlesFrag
    }
  }

  ${RESUME_CONNECTION_FRAGMENT}
`;

export const useListResumesQuery: UseListResumesQuery = () => {
  return useQuery<ResumeTitles, ResumeTitlesVariables>(LIST_RESUMES_QUERY, {
    variables: {
      howMany: 10000,
    },

    fetchPolicy: "cache-and-network",
  });
};

export interface ListResumesProps {
  resumeTitlesGql: ReturnType<typeof useListResumesQuery>;
}

type UseListResumesQuery = () => QueryResult<
  ResumeTitles,
  ResumeTitlesVariables
>;
