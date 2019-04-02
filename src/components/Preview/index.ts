import { compose, graphql } from "react-apollo";

import {
  GetResume,
  GetResumeVariables
} from "../../graphql/apollo/types/GetResume";
import { Preview } from "./preview-x";
import { OwnProps, Mode } from "./preview";
import {
  getResumeQuery,
  GetResumeProps
} from "../../graphql/apollo/get-resume.query";
import { withMatchHOC } from "../components";
import { RESUME_PATH } from "../../routing";
import { ResumePathMatch } from "../../routing";

const getResumeGql = graphql<
  OwnProps,
  GetResume,
  GetResumeVariables,
  GetResumeProps | void
>(getResumeQuery, {
  props: ({ data }) => data,

  skip: ({ mode }) => mode === Mode.preview,

  options: ({ match }) => {
    // istanbul ignore next: trust @reach/router to parse the param correctly.
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
  getResumeGql
)(Preview);
