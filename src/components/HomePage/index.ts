import { HomePage as App } from "./home-page-x";
import { withUserHOC } from "../with-user-hoc";

export const HomePage = withUserHOC(App);
