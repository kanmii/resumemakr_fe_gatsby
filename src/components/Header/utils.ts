import { MatchRenderProps } from "@reach/router";
import { ResumePathMatch } from "../../routing";

export interface OwnProps {
  leftMenuItems?: JSX.Element[];
  rightMenuItems?: JSX.Element[];
}

export interface Props extends OwnProps {
  matchResumeRouteProps: MatchRenderProps<ResumePathMatch>;
}

