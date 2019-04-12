// tslint:disable: no-any
import React, { ComponentType } from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";

import { HomePage } from "../components/HomePage/home-page-x";
import { Props, uiTexts } from "../components/HomePage/home-page";
import { RESUMES_HOME_PATH } from "../routing";

jest.mock("../components/SignUp", () => {
  return () => null;
});

jest.mock("../components/Header", () => {
  return () => null;
});

const HomeP = HomePage as ComponentType<Partial<Props>>;

it("navigates to resumes page", () => {
  const mockNavigate = jest.fn();
  const {} = render(<HomeP user={{} as any} navigate={mockNavigate} />);
  expect(mockNavigate).toHaveBeenCalledWith(RESUMES_HOME_PATH);
});

it("renders home page", () => {
  const mockNavigate = jest.fn();
  const { getByText } = render(<HomeP navigate={mockNavigate} />);
  expect(getByText(uiTexts.story.header)).toBeInTheDocument();
  expect(mockNavigate).not.toHaveBeenCalled();
});
