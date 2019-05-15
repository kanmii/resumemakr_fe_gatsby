import { RouteComponentProps } from "@reach/router";
import { WithUser } from "../with-user-hoc";

export interface Props extends RouteComponentProps, WithUser {}

export const uiTexts = {
  story: {
    header: "Built for your career success"
  }
};
