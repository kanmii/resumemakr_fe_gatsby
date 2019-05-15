import { graphql, compose } from "react-apollo";

import { ResumesPage as App } from "./resume-pages-x";
import CREATE_RESUME_TITLE, {
  CreateResumeProps
} from "../../graphql/apollo/create-resume.mutation";
import CLONE_RESUME, {
  CloneResumeProps
} from "../../graphql/apollo/clone-resume.mutation";
import {
  CreateResume,
  CreateResumeVariables
} from "../../graphql/apollo/types/CreateResume";
import {
  ResumeTitles,
  ResumeTitlesVariables
} from "../../graphql/apollo/types/ResumeTitles";
import {
  CloneResume,
  CloneResumeVariables
} from "../../graphql/apollo/types/CloneResume";
import RESUME_TITLES_QUERY from "../../graphql/apollo/resume-titles.query";
import { deleteResumeGql } from "../../graphql/apollo/delete-resume.mutation";
import { ResumeTitlesProps } from "./resume-pages";

const createResumeGql = graphql<
  {},
  CreateResume,
  CreateResumeVariables,
  CreateResumeProps | void
>(CREATE_RESUME_TITLE, {
  props: ({ mutate }) => {
    if (!mutate) {
      return undefined;
    }

    return {
      createResume: mutate
    };
  }
});

const resumeTitlesGql = graphql<
  {},
  ResumeTitles,
  ResumeTitlesVariables,
  ResumeTitlesProps | undefined
>(RESUME_TITLES_QUERY, {
  props: ({ data }) =>
    data && {
      resumeTitlesGql: data
    },

  options: () => ({
    variables: {
      howMany: 10
    },

    fetchPolicy: "cache-and-network"
  })
});

const cloneResumeGql = graphql<
  {},
  CloneResume,
  CloneResumeVariables,
  CloneResumeProps
>(CLONE_RESUME, {
  props: ({ mutate }) => {
    return {
      cloneResume: mutate
    };
  }
});

export const ResumesPage = compose(
  resumeTitlesGql,
  createResumeGql,
  deleteResumeGql,
  cloneResumeGql
)(App);
