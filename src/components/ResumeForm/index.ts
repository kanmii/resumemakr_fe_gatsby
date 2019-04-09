import { graphql, compose } from "react-apollo";
import { withFormik } from "formik";

import {
  GetResume,
  GetResumeVariables,
  GetResume_getResume
} from "../../graphql/apollo/types/GetResume";
import ResumeForm from "./resume-form-x";
import { updateResumeGql } from "../../graphql/apollo/update-resume.mutation";
import { OwnProps, formikConfig } from "./resume-form";
import {
  getResumeQuery,
  GetResumeProps
} from "../../graphql/apollo/get-resume.query";
import { getInitialValues } from "./resume-form";
import { withMatchHOC } from "../components";
import { RESUME_PATH, ResumePathMatch } from "../../routing";

const getResumeGql = graphql<
  OwnProps,
  GetResume,
  GetResumeVariables,
  GetResumeProps | void
>(getResumeQuery, {
  props: ({ data }) => {
    if (!data) {
      return data;
    }

    const { getResume } = data;

    return {
      ...data,
      getResume: getInitialValues(getResume) as GetResume_getResume
    };
  },

  options: ({ match }) => {
    // istanbul ignore next: trust @reach/router to properly parse url params
    const title = (match && match.title) || "";

    return {
      variables: {
        input: {
          title: decodeURIComponent(title)
        }
      },

      fetchPolicy: "cache-and-network"
    };
  }
});

export default compose(
  withMatchHOC<OwnProps, ResumePathMatch>(RESUME_PATH),
  getResumeGql,
  withFormik(formikConfig),
  updateResumeGql
)(ResumeForm);
