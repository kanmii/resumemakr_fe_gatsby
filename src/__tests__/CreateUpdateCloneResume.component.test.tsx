/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ComponentType } from "react";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
} from "@testing-library/react";
import { CreateUpdateCloneResume } from "../components/CreateUpdateCloneResume/create-update-clone-resume.component";
import {
  Props,
  Mode,
} from "../components/CreateUpdateCloneResume/create-update-clone-resume.utils";
import {
  domTitleInputId,
  domDescriptionInputId,
  domSubmitBtnId,
  domSubmittingOverlayId,
  domSubmitSuccessId,
  domTitleErrorId,
  domDescriptionErrorId,
} from "../components/CreateUpdateCloneResume/create-update-clone-resume.dom-selectors";
import { fillField } from "./test_utils";
import { UpdateResumeMinimalMutationFnOptions } from "../graphql/apollo/update-resume.mutation";
import { UpdateResumeMinimalVariables } from "../graphql/apollo-types/UpdateResumeMinimal";
import { act } from "react-dom/test-utils";

describe("component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    cleanup();
  });

  it("updates resume successfully", async () => {
    /**
     * Given that we are using the component
     */
    const { ui, mockUpdateResume } = makeComp({
      props: {
        mode: Mode.update,
        resume: {
          id: "a",
          title: "ta",
          description: "da",
        },
      },
    });

    const {} = render(ui);

    /**
     * Then form fields should be pre-filled with resume values
     */
    const domTitleField = document.getElementById(
      domTitleInputId,
    ) as HTMLInputElement;

    expect(domTitleField.value).toBe("ta");

    const domDescriptionField = document.getElementById(
      domDescriptionInputId,
    ) as HTMLInputElement;

    expect(domDescriptionField.value).toBe("da");

    /**
     * And we should not see field errors
     */
    expect(document.getElementById(domTitleErrorId)).toBeNull();
    expect(document.getElementById(domDescriptionErrorId)).toBeNull();

    /**
     * When we submit the form
     */
    const domSubmitEl = document.getElementById(
      domSubmitBtnId,
    ) as HTMLButtonElement;

    domSubmitEl.click();

    /**
     * Then we should not see submitting overlay UI
     */
    expect(document.getElementById(domSubmittingOverlayId)).toBeNull();

    /**
     * And no data should be sent to server
     */
    expect(mockUpdateResume).not.toHaveBeenCalled();

    /**
     * And we should see field errors
     */
    expect(document.getElementById(domTitleErrorId)).not.toBeNull();
    expect(document.getElementById(domDescriptionErrorId)).not.toBeNull();

    /**
     * When we complete the fields with new data
     */
    fillField(domTitleField, "tb");
    // fireEvent.blur(domTitleField);
    // fillField(domDescriptionField, "db");
    // fireEvent.blur(domDescriptionField);

    /**
     * Then we should not see submitting overlay UI
     */
    expect(document.getElementById(domSubmittingOverlayId)).toBeNull();

    /**
     * When we submit the form
     */

    domSubmitEl.click();

    /**
     * Then we should see loading indicator UI
     */
    expect(document.getElementById(domSubmittingOverlayId)).not.toBeNull();

    /**
     * And we should not see success message
     */
    expect(document.getElementById(domSubmitSuccessId)).toBeNull();

    /**
     * After a while, we should see success message
     */
    await waitForElement(() => {
      return document.getElementById(domSubmitSuccessId);
    });

    /**
     * And correct data should have been sent to the server
     */
    const callArgs = mockUpdateResume.mock
      .calls[0][0] as UpdateResumeMinimalMutationFnOptions;

    const expectedCallArgs: UpdateResumeMinimalVariables["input"] = {
      id: "a",
      title: "tb",
    };

    expect((callArgs.variables as UpdateResumeMinimalVariables).input).toEqual(
      expectedCallArgs,
    );

    /**
     * And component should still be visible
     */
    expect(domTitleField).not.toBeNull();

    /**
     * After a little while, the component should no longer be visible
     */
    act(() => {
      jest.runAllTimers();
      expect(document.getElementById(domTitleInputId)).toBeNull();
    });
  });
});

////////////////////////// HELPER FUNCTIONS ///////////////////////////

const CreateUpdateCloneResumeP = CreateUpdateCloneResume as ComponentType<
  Partial<Props>
>;

function makeComp({ props = {} }: { props?: Partial<{}> } = {}) {
  const mockOnClose = jest.fn();
  const mockUpdateResume = jest.fn();

  return {
    ui: (
      <CreateUpdateCloneResumeP
        updateResume={mockUpdateResume}
        onClose={mockOnClose}
        {...props}
      />
    ),
    mockOnClose,
    mockUpdateResume,
  };
}
