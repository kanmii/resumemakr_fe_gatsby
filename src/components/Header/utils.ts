import { MatchRenderProps } from "@reach/router";
import { LogoImageQuery_file_childImageSharp_fixed } from "../../graphql/gatsby-types/LogoImageQuery";
import { UserLocalGqlProps } from "../../state/auth.local.query";
import { UserLocalMutationProps } from "../../state/user.local.mutation";
import { ResumePathMatch } from "../../routing";

export interface OwnProps {
  leftMenuItems?: JSX.Element[];
  rightMenuItems?: JSX.Element[];
}

export interface Props
  extends OwnProps,
    UserLocalGqlProps,
    UserLocalMutationProps,
    WithLogo {
  matchResumeRouteProps: MatchRenderProps<ResumePathMatch>;
}

export interface WithLogo {
  logoAttrs: LogoImageQuery_file_childImageSharp_fixed;
}
