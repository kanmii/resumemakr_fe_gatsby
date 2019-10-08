/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentType } from "react";
import { render, cleanup } from "@testing-library/react";
import { Header } from "../components/Header/header.component";
import { Props } from "../components/Header/utils";
import { getUser } from "../state/tokens";
import { renderWithRouter } from "./test_utils";
import { useUserLocalMutation } from "../state/user.local.mutation";

jest.mock("../components/Header/header.injectables", () => ({
  useLogo: () => ({}),
}));

jest.mock("../state/tokens");
jest.mock("../state/user.local.mutation");
const mockUseLocalUserMutation = useUserLocalMutation as jest.Mock;
const mockGetUser = getUser as jest.Mock;

beforeEach(() => {
  mockGetUser.mockReset();
  mockUseLocalUserMutation.mockReset();
});

afterEach(() => {
  cleanup();
});

it("renders", () => {
  const { ui } = makeComp({
    props: {},
  });

  const {} = render(ui);
});

////////////////////////// HELPER FUNCTIONS ///////////////////////////

const HeaderP = Header as ComponentType<Partial<Props>>;

function makeComp({ props = {} }: { props?: Partial<Props> } = {}) {
  const { Ui, ...rest } = renderWithRouter(HeaderP);
  const updateLocalUser = jest.fn();
  mockUseLocalUserMutation.mockReturnValue([updateLocalUser]);

  return {
    ui: <Ui matchResumeRouteProps={rest as any} {...rest} {...props} />,
    updateLocalUser,
    ...rest,
  };
}
