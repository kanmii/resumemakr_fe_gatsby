import React from "react";
import { graphql } from "react-apollo";
import compose from "lodash/flowRight";
import { MyResumes as App } from "./my-resumes.component";
import {
  ResumeTitles,
  ResumeTitlesVariables,
} from "../../graphql/apollo-types/ResumeTitles";
import RESUME_TITLES_QUERY from "../../graphql/apollo/resume-titles.query";
import { deleteResumeGql } from "../../graphql/apollo/delete-resume.mutation";
import { ResumeTitlesProps } from "./my-resumes.utils";
import { Props } from "./my-resumes.utils";
import { useCreateResumeMutation } from "../../graphql/apollo/create-resume.mutation";
import { useCloneResumeMutation } from "../../graphql/apollo/clone-resume.mutation";

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

export default compose(
  resumeTitlesGql,
  deleteResumeGql,
)((props: Props) => {
  return (
    <App
      {...props}
      cloneResume={useCloneResumeMutation()[0]}
      createResume={useCreateResumeMutation()[0]}
    />
  );
});
