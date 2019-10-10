import { Experiences as Comp } from "./experiences.component";
import { Props } from "./experiences.utils";
import { withLocationHOC } from "../with-location-hoc";

export const Experiences = withLocationHOC<Props>(Comp);
