import "cypress-testing-library/add-commands";
import "cypress-file-upload";
import { MutationOptions } from "apollo-client/core/watchQueryOptions";
import { FetchResult } from "react-apollo";

import { USER_TOKEN_ENV_KEY } from "./constants";
import { getBackendUrls } from "../../src/State/get-backend-urls";
import { buildClientCache } from "../../src/State/apollo-setup";
import { clearToken } from "../../src/State/tokens";

declare global {
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
        options: MutationOptions<TData, TVariables>
      ) => Promise<
        // tslint:disable-next-line: no-any
        FetchResult<TData, Record<string, any>, Record<string, any>>
      >;
    }
  }
}

const serverUrl = getBackendUrls(Cypress.env("apiUri"));

Cypress.Commands.add("checkoutSession", () => {
  clearToken();

  cy.request("POST", serverUrl.root + "/iennc67hx1", {}).then(response => {
    expect(response.body).to.have.property("ok", "ok");
  });
});

Cypress.Commands.add(
  "mutate",
  <TData, TVariables>(options: MutationOptions<TData, TVariables>) => {
    const { client } = buildClientCache({
      uri: serverUrl.apiUrl,

      headers: {
        jwt: Cypress.env(USER_TOKEN_ENV_KEY)
      }
    });

    return client.mutate<TData, TVariables>(options);
  }
);
