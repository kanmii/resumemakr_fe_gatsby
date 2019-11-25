import { graphql } from "react-apollo";
import compose from "lodash/flowRight";
import {
  GetResume,
  GetResumeVariables,
} from "../../graphql/apollo-types/GetResume";
import { Preview as App } from "./preview.component";
import { OwnProps, Mode, MatchProps, Props } from "./preview.utils";
import {
  GET_RESUME_QUERY,
  GetResumeProps,
} from "../../graphql/apollo/get-resume.query";
import { withMatchHOC } from "../with-match-hoc";
import { RESUME_PATH } from "../../routing";
import { ResumePathMatch } from "../../routing";
import { ComponentType } from "react";
import { UpdateResumeInput } from "../../graphql/apollo-types/globalTypes";

const getResumeGql = graphql<
  MatchProps & OwnProps,
  GetResume,
  GetResumeVariables,
  GetResumeProps | void
>(GET_RESUME_QUERY, {
  props: ({ data }) => data,

  skip: ({ mode }) => mode === Mode.preview,

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

export const Preview = compose(
  withMatchHOC<Props, ResumePathMatch>(RESUME_PATH),
  getResumeGql,
)(App) as ComponentType<
  OwnProps & {
    getResume?: Partial<UpdateResumeInput>;
  }
>;
