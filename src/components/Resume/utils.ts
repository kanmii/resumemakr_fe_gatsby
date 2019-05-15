import { RouteComponentProps } from "@reach/router";

export interface Props extends RouteComponentProps<{ title: string }> {
  header: JSX.Element;
}
