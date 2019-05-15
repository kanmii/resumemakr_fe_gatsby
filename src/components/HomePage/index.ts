import { HomePage as App } from "./component";
import { withUserHOC } from "../with-user-hoc";

export const HomePage = withUserHOC(App);
