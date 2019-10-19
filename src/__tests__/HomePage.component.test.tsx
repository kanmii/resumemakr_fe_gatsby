/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentType } from "react";
import { render, cleanup } from "@testing-library/react";
import { HomePage } from "../components/HomePage/home-page.component";
import { Props } from "../components/HomePage/home-page.utils";
import { prefix as domId } from "../components/HomePage/home-page.dom-selectors";
import { RESUMES_HOME_PATH } from "../routing";
import { renderWithRouter } from "./test_utils";
import { getUser } from "../state/tokens";

jest.mock("../components/SignUp/signup.index", () => ({
  SignUp: jest.fn(() => null),
}));

jest.mock("../components/Header", () => ({
  Header: jest.fn(() => null),
}));

jest.mock("../state/tokens");

const mockGetUser = getUser as jest.Mock;

beforeEach(() => {
  mockGetUser.mockReset();
});

afterEach(() => {
  cleanup();
});

it("navigates to resumes page", () => {
  mockGetUser.mockReturnValue({});
  const { ui, mockNavigate } = makeComp();

  render(ui);
  expect(mockNavigate).toHaveBeenCalledWith(RESUMES_HOME_PATH);
});

it("renders home page", () => {
  const { ui, mockNavigate } = makeComp();

  render(ui);
  expect(document.getElementById(domId)).not.toBeNull();
  expect(mockNavigate).not.toHaveBeenCalled();
});

////////////////////////// HELPERS ////////////////////////////

const HomeP = HomePage as ComponentType<Partial<Props>>;

function makeComp(props: Partial<Props> = {}) {
  const { Ui, ...rest } = renderWithRouter(HomeP, props);

  return {
    ui: <Ui />,
    ...rest,
  };
}
