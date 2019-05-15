import { Experiences as Comp } from "./component";
import { Props } from "./utils";
import { withLocationHOC } from "../with-location-hoc";

export const Experiences = withLocationHOC<Props>(Comp);
