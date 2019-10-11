import { MatchRenderProps } from "@reach/router";

import { GetResumeProps } from "../../graphql/apollo/get-resume.query";
import { ResumePathMatch } from "../../routing";

export interface OwnProps
  extends MatchRenderProps<ResumePathMatch>,
    GetResumeProps {
  mode: Mode;
}

export type Props = OwnProps;

export enum Mode {
  download = "download",
  preview = "preview"
}
