/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-namespace */
import "cypress-testing-library/add-commands";
import "cypress-file-upload";
import { MutationOptions } from "apollo-client/core/watchQueryOptions";
import { getBackendUrls } from "../../src/state/get-backend-urls";
import {
  buildClientCache,
  CYPRESS_APOLLO_KEY,
} from "../../src/state/apollo-setup";
import ApolloClient from "apollo-client";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
import { FetchResult } from "apollo-link";

const serverUrl = getBackendUrls(Cypress.env("API_URL"));

Cypress.Commands.add("checkoutSession", checkoutSession);

Cypress.Commands.add(
  "mutate",
  <TData, TVariables>(options: MutationOptions<TData, TVariables>) => {
    const client = Cypress.env(CYPRESS_APOLLO_KEY).client as ApolloClient<{}>;

    return client.mutate<TData, TVariables>(options);
  },
);

function checkoutSession() {
  window.localStorage.clear();

  buildClientCache({
    uri: serverUrl.apiUrl,
    newE2eTest: true,
  });

  cy.request("POST", serverUrl.root + "/iennc67hx1", {}).then(response => {
    expect(response.body).to.have.property("ok", "ok");
  });
}

declare global {
  interface Window {
    Cypress: {
      env: <T>(k?: string, v?: T) => void | T;
    };
  }

  namespace Cypress {
    interface Chainable {
      /**
       *
       */
      checkoutSession: () => Chainable<Promise<void>>;

      /**
       *
       */
      waitForFetches: () => Chainable<Promise<void>>;

      /**
       *
       */

      mutate: <TData, TVariables>(
        options: MutationOptions<TData, TVariables>,
      ) => Promise<
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        FetchResult<TData, Record<string, any>, Record<string, any>>
      >;
    }
  }
}
