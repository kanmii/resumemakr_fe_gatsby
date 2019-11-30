import React from "react";
import { MyResumes as App } from "./my-resumes.component";
import { useDeleteResumeMutation } from "../../graphql/apollo/delete-resume.mutation";
import { Props } from "./my-resumes.utils";
import { useCreateResumeMutation } from "../../graphql/apollo/create-resume.mutation";
import { useCloneResumeMutation } from "../../graphql/apollo/clone-resume.mutation";
import { useListResumesQuery } from "../../graphql/apollo/resume-titles.query";

export default (props: Props) => {
  return (
    <App
      {...props}
      cloneResume={useCloneResumeMutation()[0]}
      createResume={useCreateResumeMutation()[0]}
      resumeTitlesGql={useListResumesQuery()}
      deleteResume={useDeleteResumeMutation()[0]}
    />
  );
};
