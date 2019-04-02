import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, wait, fireEvent } from "react-testing-library";
import { getByText as domGetByText, waitForElement } from "dom-testing-library";
import "jest-styled-components";

import PhotoField from "../components/PhotoField";
import { createFile, uploadFile } from "./test_utils";
import { FormContextProvider } from "../components/ResumeForm/resume-form";

it("changes to preview on file select", async () => {
  const { ui } = setUp();

  const {
    getByLabelText,
    queryByTestId,
    queryByLabelText,
    getByTestId
  } = render(ui);

  await wait(() =>
    expect(queryByTestId("photo-preview")).not.toBeInTheDocument()
  );

  uploadFile(
    getByLabelText(/Upload Photo/),
    createFile("dog.jpg", 1234, "image/jpeg")
  );

  await wait(() => {
    expect(queryByLabelText(/Upload Photo/)).not.toBeInTheDocument();
  });

  expect(getByTestId("photo-preview")).toHaveStyleRule(
    "background-image",
    /url/
  );
});

it("toggles edit buttons on mouse move on preview", async () => {
  const { ui } = setUp();
  const { getByLabelText, getByTestId, queryByTestId } = render(ui);

  uploadFile(
    getByLabelText("Upload Photo"),
    createFile("dog.jpg", 1234, "image/jpeg")
  );

  await wait(() => {
    const $preview = getByTestId("photo-preview") as HTMLDivElement;
    expect(queryByTestId("edit-btns")).not.toBeInTheDocument();

    // MOUSE ENTER
    fireEvent.mouseEnter($preview);
    expect(getByTestId("edit-btns")).toBeInTheDocument();

    // MOUSE LEAVE
    fireEvent.mouseLeave($preview);
    expect(queryByTestId("edit-btns")).not.toBeInTheDocument();
  });
});

it("shows edit buttons when preview clicked", async () => {
  const { ui } = setUp();
  const { getByLabelText, getByTestId, queryByTestId } = render(ui);

  uploadFile(
    getByLabelText("Upload Photo"),
    createFile("dog.jpg", 1234, "image/jpeg")
  );

  expect(queryByTestId("edit-btns")).not.toBeInTheDocument();

  const $preview = await waitForElement(() => getByTestId("photo-preview"));

  fireEvent.click($preview);

  expect(getByTestId("edit-btns")).toBeInTheDocument();
});

it("deletes photo", async () => {
  const { ui } = setUp();
  const { getByLabelText, getByTestId, getByText, queryByTestId } = render(ui);

  uploadFile(
    getByLabelText("Upload Photo"),
    createFile("dog.jpg", 1234, "image/jpeg")
  );

  await wait(() => {
    /**
     * When she mouses over the photo
     */
    fireEvent.mouseEnter(getByTestId("photo-preview"));
  });

  /**
   * And clicks the photo remove button
   */
  fireEvent.click(getByText("Remove"));

  /**
   * She sees a modal dialog on the page
   */

  const $modalDescription = getByText(/Do you really want to remove photo\?/);

  /**
   * When she clicks on the yes button
   */

  fireEvent.click(
    domGetByText($modalDescription.closest(".modal") as HTMLDivElement, /Yes/i)
  );

  /**
   * She sees that the photo preview has gone from the page
   */

  expect(queryByTestId("photo-preview")).not.toBeInTheDocument();
});

xit("changes photo", async () => {
  const { mockSetFieldValue, ui, fieldName } = setUp();
  const { getByLabelText, getByTestId } = render(ui);

  const file1 = createFile("dog.jpg", 1234, "image/jpeg");
  const file2 = createFile("cat.jpg", 2345, "image/jpeg");
  uploadFile(getByLabelText("Upload Photo"), file1);

  await wait(() =>
    expect(mockSetFieldValue.mock.calls[0]).toEqual([fieldName, file1])
  );

  await wait(() => fireEvent.mouseEnter(getByTestId("photo-preview")));

  uploadFile(getByLabelText("Change photo"), file2);

  await wait(() =>
    expect(mockSetFieldValue.mock.calls[1]).toEqual([fieldName, file2])
  );
});

it("does not set field value if no file selected", async () => {
  const { mockSetFieldValue, ui } = setUp();

  const { getByLabelText } = render(ui);

  uploadFile(getByLabelText("Upload Photo"));
  await wait(() => expect(mockSetFieldValue).not.toBeCalled());
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function ResumeForm(props: React.PropsWithChildren<{}>) {
  return (
    <FormContextProvider value={{ valueChanged: jest.fn() }}>
      {props.children}
    </FormContextProvider>
  );
}

function setUp(fieldName: string = "photo") {
  // tslint:disable-next-line:no-any
  const PhotoField1 = PhotoField as any;
  const mockSetFieldValue = jest.fn();
  const mockRemoveFilePreview = jest.fn();

  return {
    ui: (
      <ResumeForm>
        <PhotoField1
          field={{ name: fieldName }}
          form={{
            setFieldValue: mockSetFieldValue
          }}
          removeFilePreview={mockRemoveFilePreview}
        />
      </ResumeForm>
    ),
    mockSetFieldValue,
    mockRemoveFilePreview,
    fieldName
  };
}
