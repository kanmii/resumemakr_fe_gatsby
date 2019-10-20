import { MatchRenderProps } from "@reach/router";
import { GetResumeProps } from "../../graphql/apollo/get-resume.query";
import { ResumePathMatch } from "../../routing";

export interface OwnProps {
  mode: Mode;
}

export type MatchProps = MatchRenderProps<ResumePathMatch>;

export interface Props extends MatchProps, GetResumeProps, OwnProps {}

export enum Mode {
  download = "download",
  preview = "preview",
}
