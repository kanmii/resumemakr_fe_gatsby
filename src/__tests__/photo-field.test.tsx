import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, wait, fireEvent } from "react-testing-library";
import { getByText as domGetByText, waitForElement } from "dom-testing-library";

import { PhotoField } from "../components/PhotoField/photo-field-x";
import {
  createFile,
  uploadFile,
  jpegMime,
  jpegBase64StringPrefix
} from "./test_utils";
import {
  FormContextProvider,
  ResumeFormContextValue
} from "../components/UpdateResumeForm/update-resume-form";
import { uiTexts, Props } from "../components/PhotoField/photo-field";

it("changes to preview on file select", async () => {
  /**
   * Given a user is at the photo select field
   */
  const { ui } = setUp();

  const {
    getByLabelText,
    queryByTestId,
    queryByLabelText,
    getByTestId
  } = render(ui);

  /**
   * Then user should see that the field as no photo
   */

  expect(queryByTestId("photo-preview")).not.toBeInTheDocument();

  /**
   * When user selects a photo
   */
  uploadFile(
    getByLabelText(uiTexts.uploadPhotoText),
    createFile("dog.jpg", 1234, jpegMime)
  );

  /**
   * Then the upload field should no longer be visible
   */
  await wait(
    () => {
      expect(queryByLabelText(uiTexts.uploadPhotoText)).not.toBeInTheDocument();
    },
    {
      interval: 1
    }
  );

  /**
   * And the preview field should be visible
   */
  expect(getByTestId("photo-preview").style.backgroundImage).toMatch(
    /url\(.+?\)/
  );
});

it("toggles edit buttons on mouse move on preview", async () => {
  /**
   * Given a user is at the photo field
   */
  const { ui } = setUp();
  const { getByLabelText, getByTestId, queryByTestId } = render(ui);

  /**
   * And user selects a photo
   */
  uploadFile(
    getByLabelText(uiTexts.uploadPhotoText),
    createFile("dog.jpg", 1234, jpegMime)
  );

  /**
   * Then user should see the photo in preview mode
   */
  const $preview = await waitForElement(
    () => getByTestId("photo-preview") as HTMLDivElement
  );

  /**
   * And user should not see UI elements that can be used to edit the photo
   */
  expect(queryByTestId("edit-btns")).not.toBeInTheDocument();

  /**
   * When user hovers over the photo
   */
  fireEvent.mouseEnter($preview);

  /**
   * Then user should see UI elements that can be used to edit the photo
   */
  expect(getByTestId("edit-btns")).toBeInTheDocument();

  /**
   * When user removes the mouse from over the photo
   */
  fireEvent.mouseLeave($preview);

  /**
   * Then user should not see UI elements that can be used to edit the photo
   */
  expect(queryByTestId("edit-btns")).not.toBeInTheDocument();
});

it("shows edit buttons when preview clicked", async () => {
  /**
   * Given user is at photo field
   */
  const { ui } = setUp();
  const { getByLabelText, getByTestId, queryByTestId } = render(ui);

  /**
   * And user selects a photo
   */
  uploadFile(
    getByLabelText(uiTexts.uploadPhotoText),
    createFile("dog.jpg", 1234, jpegMime)
  );

  /**
   * Then user should not see UI elements that can be used to edit the photo
   */
  expect(queryByTestId("edit-btns")).not.toBeInTheDocument();

  /**
   * When user clicks on the photo
   */
  const $preview = await waitForElement(() => getByTestId("photo-preview"));
  fireEvent.click($preview);

  /**
   * Then user should see UI elements that can be used to edit the photo
   */
  expect(getByTestId("edit-btns")).toBeInTheDocument();
});

it("deletes photo", async () => {
  /**
   * Given a user is at the photo field
   */
  const { ui } = setUp();
  const { getByLabelText, getByTestId, getByText, queryByTestId } = render(ui);

  /**
   * And user selects a photo
   */
  uploadFile(
    getByLabelText(uiTexts.uploadPhotoText),
    createFile("dog.jpg", 1234, jpegMime)
  );

  /**
   * When she mouses over the photo
   */
  await wait(
    () => {
      fireEvent.mouseEnter(getByTestId("photo-preview"));
    },
    {
      interval: 1
    }
  );

  /**
   * And clicks the photo remove button
   */
  fireEvent.click(getByText(uiTexts.deletePhotoText));

  /**
   * Then she sees a modal dialog on the page
   */

  const $modalDescription = getByText(
    new RegExp(uiTexts.deletePhotoConfirmationText, "i")
  );

  /**
   * When she clicks on the yes button
   */

  fireEvent.click(
    domGetByText(
      $modalDescription.closest(".modal") as HTMLDivElement,
      uiTexts.positiveToRemovePhotoText
    )
  );

  /**
   * She sees that the photo preview has gone from the page
   */

  expect(queryByTestId("photo-preview")).not.toBeInTheDocument();
});

it("changes photo", async () => {
  const { mockSetFieldValue, ui, fieldName } = setUp();
  const { getByLabelText, getByTestId } = render(ui);

  const file1 = createFile("dog.jpg", 1234, jpegMime);
  const file2 = createFile("cat.jpg", 2345, jpegMime);
  uploadFile(getByLabelText(uiTexts.uploadPhotoText), file1);

  await wait(
    () => {
      expect(mockSetFieldValue.mock.calls[0]).toEqual([
        fieldName,
        jpegBase64StringPrefix
      ]);
    },
    { interval: 1 }
  );

  await wait(
    () => {
      fireEvent.mouseEnter(getByTestId("photo-preview"));
    },
    {
      interval: 1
    }
  );

  uploadFile(getByLabelText(uiTexts.changePhotoText), file2);

  await wait(
    () => {
      expect(mockSetFieldValue.mock.calls[1]).toEqual([
        fieldName,
        jpegBase64StringPrefix
      ]);
    },
    { interval: 1 }
  );
});

it("does not set field value if no file selected", async () => {
  const { mockSetFieldValue, ui } = setUp();

  const { getByLabelText } = render(ui);

  uploadFile(getByLabelText(uiTexts.uploadPhotoText));
  await wait(() => expect(mockSetFieldValue).not.toBeCalled());
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function ResumeForm(props: React.PropsWithChildren<{}>) {
  return (
    <FormContextProvider
      value={({ valueChanged: jest.fn() } as unknown) as ResumeFormContextValue}
    >
      {props.children}
    </FormContextProvider>
  );
}

function setUp(fieldName: string = "photo") {
  const PhotoField1 = PhotoField as React.ComponentType<Partial<Props>>;
  const mockSetFieldValue = jest.fn();
  const mockRemoveFilePreview = jest.fn();
  // tslint:disable-next-line: no-any
  const field = { name: fieldName } as any;
  // tslint:disable-next-line: no-any
  const form = { setFieldValue: mockSetFieldValue } as any;

  return {
    ui: (
      <ResumeForm>
        <PhotoField1
          field={field}
          form={form}
          removeFilePreview={mockRemoveFilePreview}
        />
      </ResumeForm>
    ),
    mockSetFieldValue,
    mockRemoveFilePreview,
    fieldName
  };
}
