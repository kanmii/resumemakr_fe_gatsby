import { compose, graphql } from "react-apollo";
import {
  GetResume,
  GetResumeVariables
} from "../../graphql/apollo-types/GetResume";
import { Preview as App } from "./preview.component";
import { OwnProps, Mode } from "./preview.utils";
import {
  getResumeQuery,
  GetResumeProps
} from "../../graphql/apollo/get-resume.query";
import { withMatchHOC } from "../with-match-hoc";
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

export const Preview = compose(
  withMatchHOC<OwnProps, ResumePathMatch>(RESUME_PATH),
  getResumeGql
)(App);
