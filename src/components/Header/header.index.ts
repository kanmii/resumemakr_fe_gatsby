import { Header as Comp } from "./header.component";
import { withMatchHOC } from "../with-match-hoc";
import { RESUME_PATH } from "../../routing";
import { Props, OwnProps } from "./utils";
import { ComponentType } from "react";

export const Header = withMatchHOC<Props>(RESUME_PATH, "matchResumeRouteProps")(
  Comp,
) as ComponentType<OwnProps>;
