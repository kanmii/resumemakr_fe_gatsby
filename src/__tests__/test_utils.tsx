import React, { FunctionComponent, ComponentClass } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "react-apollo";
import { fireEvent } from "react-testing-library";

export function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink()
  });
}

export interface HistoryProps {
  push?: (path: string) => void;
  replace?: (path: string) => void;
  resumeMakrPath?: string;
  match?: {};
}

export function renderWithApollo<TProps>(
  Ui: FunctionComponent<TProps> | ComponentClass<TProps>
) {
  const client = makeClient();

  return {
    client,
    Ui: (props: TProps) => (
      <ApolloProvider client={client}>
        <Ui client={client} {...props} />
      </ApolloProvider>
    )
  };
}

export function fillField(element: Element, value: string) {
  fireEvent.change(element, {
    target: { value }
  });
}

/**
 * ## Example
 *  createFile('dog.jpg', 1234, 'image/jpeg')
 * @param fileName
 * @param size
 * @param type
 */
export function createFile(fileName: string, size: number, type: string) {
  const file = new File([], fileName, { type });

  Object.defineProperty(file, "size", {
    get() {
      return size;
    }
  });

  return file;
}

export function uploadFile($input: HTMLElement, file?: File) {
  Object.defineProperty($input, "files", {
    value: (file && [file]) || []
  });

  fireEvent.change($input);
}

export interface WithData<TData> {
  data: TData;
}
