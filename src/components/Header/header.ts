import { LogoImageQuery_file_childImageSharp_fixed } from "../../graphql/gatsby/types/LogoImageQuery";

import { UserLocalGqlProps } from "../../State/auth.local.query";
import { UserLocalMutationProps } from "../../State/user.local.mutation";

export interface OwnProps {
  leftMenuItems?: JSX.Element[];
  rightMenuItems?: JSX.Element[];
}

export interface Props
  extends OwnProps,
    UserLocalGqlProps,
    UserLocalMutationProps,
    WithLogo {}

export interface WithLogo {
  logoAttrs: LogoImageQuery_file_childImageSharp_fixed;
}
