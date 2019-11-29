import React from "react";
import { graphql } from "react-apollo";
import compose from "lodash/flowRight";
import { MyResumes as App } from "./my-resumes.component";
import CLONE_RESUME, {
  CloneResumeProps,
} from "../../graphql/apollo/clone-resume.mutation";
import {
  ResumeTitles,
  ResumeTitlesVariables,
} from "../../graphql/apollo-types/ResumeTitles";
import {
  CloneResume,
  CloneResumeVariables,
} from "../../graphql/apollo-types/CloneResume";
import RESUME_TITLES_QUERY from "../../graphql/apollo/resume-titles.query";
import { deleteResumeGql } from "../../graphql/apollo/delete-resume.mutation";
import { ResumeTitlesProps } from "./my-resumes.utils";
import { Props } from "./my-resumes.utils";
import { useCreateResumeMutation } from "../../graphql/apollo/create-resume.mutation";

const resumeTitlesGql = graphql<
  {},
  ResumeTitles,
  ResumeTitlesVariables,
  ResumeTitlesProps | undefined
>(RESUME_TITLES_QUERY, {
  props: ({ data }) =>
    data && {
      resumeTitlesGql: data,
    },

  options: () => ({
    variables: {
      howMany: 10000,
    },

    fetchPolicy: "cache-and-network",
  }),
});

const cloneResumeGql = graphql<
  {},
  CloneResume,
  CloneResumeVariables,
  CloneResumeProps
>(CLONE_RESUME, {
  props: ({ mutate }) => {
    return {
      cloneResume: mutate,
    };
  },
});

export default compose(
  resumeTitlesGql,
  deleteResumeGql,
  cloneResumeGql,
)((props: Props) => {
  return <App {...props} useCreateResume={useCreateResumeMutation()} />;
});
