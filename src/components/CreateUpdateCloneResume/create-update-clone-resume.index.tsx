import React, { ComponentType } from "react";
import { OwnProps, Props } from "./create-update-clone-resume.utils";
import { CreateUpdateCloneResume } from "./create-update-clone-resume.component";
import { useUpdateResumeMinimalMutation } from "../../graphql/apollo/update-resume.mutation";

export default (props: OwnProps) => {
  return (
    <CreateUpdateCloneResume
      updateResume={useUpdateResumeMinimalMutation()[0]}
      {...props}
    />
  );
};
