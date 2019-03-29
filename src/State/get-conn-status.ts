import { ApolloClient } from "apollo-client";

import { CONN_QUERY, ConnData } from "./conn.query";

export default async function getConnStatus(client: ApolloClient<{}>) {
  const { data } = await client.query<ConnData>({
    query: CONN_QUERY
  });

  return data && data.connected && data.connected.isConnected;
}
