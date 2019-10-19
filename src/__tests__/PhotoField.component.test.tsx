/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  render,
  wait,
  fireEvent,
  cleanup,
  waitForElement,
} from "@testing-library/react";
import { PhotoField } from "../components/PhotoField/photo-field.component";
import {
  createFile,
  uploadFile,
  jpegMime,
  jpegBase64StringPrefix,
} from "./test_utils";
import {
  FormContextProvider,
  ResumeFormContextValue,
} from "../components/UpdateResumeForm/update-resume.utils";
import { Props } from "../components/PhotoField/photo-field.utils";
import {
  previewId,
  fileChooserId,
  changePhotoId,
  deletePhotoId,
  photoDeleteConfirmedId,
} from "../components/PhotoField/photo-field.dom-selectors";
import { act } from "react-dom/test-utils";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  cleanup();
});

it("changes to preview on file select", async () => {
  /**
   * Given a user is at the photo select field
   */
  const { ui } = setUp();

  render(ui);

  /**
   * Then user should see that the field as no photo
   */

  expect(document.getElementById(previewId)).toBeNull();

  /**
   * When user selects a photo
   */
  uploadFile(
    document.getElementById(fileChooserId) as HTMLInputElement,
    createFile("dog.jpg", 1234, jpegMime),
  );

  /**
   * Then the preview field should be visible
   */
  const $preview = await waitForElement(() => {
    return document.getElementById(previewId) as HTMLElement;
  });

  expect($preview).not.toBeNull();

  /**
   * And upload field should no longer be visible
   */
  expect(document.getElementById(fileChooserId) as HTMLInputElement).toBeNull();
});

it("toggles edit buttons on mouse move on preview", async () => {
  /**
   * Given a user is at the photo field
   */
  const { ui } = setUp();
  render(ui);
  /**
   * And user selects a photo
   */

  uploadFile(
    document.getElementById(fileChooserId) as HTMLInputElement,
    createFile("dog.jpg", 1234, jpegMime),
  );

  /**
   * Then user should see the photo in preview mode
   */
  const $preview = await waitForElement(() => {
    return document.getElementById(previewId) as HTMLInputElement;
  });

  /**
   * And user should not see UI elements that can be used to edit the photo
   */
  expect(document.getElementById(changePhotoId)).toBeNull();

  /**
   * When user hovers over the photo
   */
  act(() => {
    fireEvent.mouseOver($preview);
    jest.runAllTimers();
  });

  /**
   * Then user should see UI elements that can be used to edit the photo
   */
  expect(document.getElementById(changePhotoId)).not.toBeNull();

  /**
   * When user removes the mouse from over the photo
   */
  fireEvent.mouseLeave($preview);

  /**
   * Then user should not see UI elements that can be used to edit the photo
   */
  expect(document.getElementById(changePhotoId)).toBeNull();
});

it("deletes photo", async () => {
  /**
   * Given a user is at the photo field
   */
  const { ui } = setUp();
  render(ui);

  /**
   * And user selects a photo
   */
  uploadFile(
    document.getElementById(fileChooserId) as HTMLInputElement,
    createFile("dog.jpg", 1234, jpegMime),
  );

  /**
   * When she mouses over the photo
   */
  const $preview = await waitForElement(() => {
    return document.getElementById(previewId) as HTMLElement;
  });

  act(() => {
    fireEvent.mouseEnter($preview);
    jest.runAllTimers();
  });

  /**
   * And clicks the photo remove button
   */
  (document.getElementById(deletePhotoId) as HTMLElement).click();

  /**
   * Then she sees a modal dialog on the page
   */

  /**
   * When she clicks on the yes button
   */

  (document.getElementById(photoDeleteConfirmedId) as HTMLElement).click();

  /**
   * She sees that the photo preview has gone from the page
   */

  expect(document.getElementById(previewId)).toBeNull();
});

it("changes photo", async () => {
  const { mockSetFieldValue, ui, fieldName } = setUp();
  render(ui);

  const file1 = createFile("dog.jpg", 1234, jpegMime);
  const file2 = createFile("cat.jpg", 2345, jpegMime);

  const $uploadPhoto = document.getElementById(
    fileChooserId,
  ) as HTMLInputElement;

  uploadFile($uploadPhoto, file1);

  await wait(() => {
    expect(mockSetFieldValue.mock.calls[0]).toEqual([
      fieldName,
      jpegBase64StringPrefix,
    ]);
  });

  const $preview = await waitForElement(() => {
    return document.getElementById(previewId) as HTMLElement;
  });

  act(() => {
    fireEvent.mouseEnter($preview);
    jest.runAllTimers();
  });

  uploadFile(document.getElementById(fileChooserId) as HTMLInputElement, file2);

  await wait(() => {
    expect(mockSetFieldValue.mock.calls[1]).toEqual([
      fieldName,
      jpegBase64StringPrefix,
    ]);
  });
});

it("does not set field value if no file selected", async () => {
  const { mockSetFieldValue, ui } = setUp();
  render(ui);

  uploadFile(document.getElementById(fileChooserId) as HTMLInputElement);
  expect(mockSetFieldValue).not.toBeCalled();
});

////////////////////////// HELPER FUNCTIONS ///////////////////////////////////

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
  const field = { name: fieldName } as any;
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
    fieldName,
  };
}
