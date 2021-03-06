import React, { FunctionComponent, ComponentClass } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "@apollo/react-hooks";
import { fireEvent } from "@testing-library/react";
import { RouteComponentProps } from "@reach/router";

export function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink(),
  });
}

export function renderWithApollo<TProps>(
  Ui: FunctionComponent<TProps> | ComponentClass<TProps>,
  initialProps: Partial<TProps> = {},
) {
  const client = makeClient();

  return {
    client,
    Ui: (props: TProps) => (
      <ApolloProvider client={client}>
        <Ui client={client} {...initialProps} {...props} />
      </ApolloProvider>
    ),
  };
}

export function renderWithRouter<TProps extends RouteComponentProps>(
  Ui: FunctionComponent<TProps> | ComponentClass<TProps>,
  routerProps: Partial<RouteComponentProps> = {},
) {
  const {
    navigate = jest.fn(),
    location = {
      pathname: "/",
    },
    ...rest
  } = routerProps;

  return {
    mockNavigate: navigate,
    location,
    ...rest,
    Ui: (props: TProps) => (
      <Ui location={location} navigate={navigate} {...rest} {...props} />
    ),
  };
}

export function fillField(element: Element, value: string) {
  fireEvent.change(element, {
    target: { value },
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
    },
  });

  return file;
}

export function uploadFile($input: HTMLElement, file?: File) {
  Object.defineProperty($input, "files", {
    value: file ? [file] : [],
  });

  fireEvent.change($input);
}

export interface WithData<TData> {
  data: TData;
}

export const jpegMime = "image/jpeg";

export const jpegBase64StringPrefix = "data:image/jpeg;base64,";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function closeMessage($element: any) {
  const domIcon =
    $element && $element.querySelector && $element.querySelector(`.close.icon`);

  if (!domIcon) {
    return;
  }

  domIcon.click();
}
