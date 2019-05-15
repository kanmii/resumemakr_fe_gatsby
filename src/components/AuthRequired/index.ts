import { AuthRequired } from "./auth-required-x";
import { withUserHOC } from "../with-user-hoc";

export default withUserHOC(AuthRequired);
