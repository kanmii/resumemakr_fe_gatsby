import { HomePage as App } from "./home-page-x";
import { withUserHOC } from "../components";

export const HomePage = withUserHOC(App);
