import React from "react";
import { Experiences as Comp } from "./experiences.component";
import { Props, emptyVal } from "./experiences.utils";
import { withLocationHOC } from "../with-location-hoc";

export const Experiences = withLocationHOC<Props>((props: Props) => (
  <Comp defaultValues={[{ ...emptyVal }]} {...props} />
));
