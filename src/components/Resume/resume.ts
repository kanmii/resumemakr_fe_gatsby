import { RouteComponentProps } from "@reach/router";

export interface Props extends RouteComponentProps<{ title: string }> {
  Header: (props: { downloadFn: () => void }) => JSX.Element;
}
