import { graphql } from "react-apollo";
import compose from "lodash/flowRight";
import { withFormik } from "formik";
import {
  GetResume,
  GetResumeVariables,
  GetResume_getResume,
} from "../../graphql/apollo-types/GetResume";
import { UpdateResumeForm as App } from "./update-resume.component";
import {
  OwnProps,
  formikConfig,
  getInitialValues,
} from "./update-resume.utils";
import {
  GET_RESUME_QUERY,
  GetResumeProps,
} from "../../graphql/apollo/get-resume.query";
import { withMatchHOC } from "../with-match-hoc";
import { RESUME_PATH, ResumePathMatch } from "../../routing";

const getResumeGql = graphql<
  OwnProps,
  GetResume,
  GetResumeVariables,
  GetResumeProps | void
>(GET_RESUME_QUERY, {
  props: ({ data }) => {
    if (!data) {
      return data;
    }

    const { getResume } = data;

    return {
      ...data,
      getResume: getInitialValues(getResume) as GetResume_getResume,
    };
  },

  options: ({ match }) => {
    const title = (match && match.title) || "";

    return {
      variables: {
        input: {
          title: decodeURIComponent(title),
        },
      },

      fetchPolicy: "cache-and-network",
    };
  },
});

export const UpdateResumeForm = compose(
  withMatchHOC<OwnProps, ResumePathMatch>(RESUME_PATH),
  getResumeGql,
  withFormik(formikConfig),
)(App);
