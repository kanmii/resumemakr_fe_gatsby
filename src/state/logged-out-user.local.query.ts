import gql from "graphql-tag";
import { DataValue, graphql } from "react-apollo";

import { userFragment } from "../graphql/apollo/user.fragment";
import { UserFragment } from "../graphql/apollo/types/UserFragment";

interface LoggedOutUserData {
  loggedOutUser?: UserFragment;
}

export interface LoggedOutUserProps {
  loggedOutUser?: DataValue<LoggedOutUserData>;
}

export const loggedOutUserGql = graphql<
  {},
  LoggedOutUserData,
  {},
  LoggedOutUserProps | undefined
>(
  gql`
    query LoggedOutUser {
      loggedOutUser @client {
        ...UserFragment
      }
    }

    ${userFragment}
  `,
  {
    props: ({ data }) =>
      data && {
        loggedOutUser: data
      }
  }
);

export default loggedOutUserGql;
