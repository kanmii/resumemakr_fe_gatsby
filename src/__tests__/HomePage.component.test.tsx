/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentType } from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";
import { HomePage } from "../components/HomePage/component";
import { Props, uiTexts } from "../components/HomePage/utils";
import { RESUMES_HOME_PATH } from "../routing";

jest.mock("../components/SignUp/signup.index", () => ({
  SignUp: jest.fn(() => null)
}));

jest.mock("../components/Header", () => ({
  Header: jest.fn(() => null)
}));

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
