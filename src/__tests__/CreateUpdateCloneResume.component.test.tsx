/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ComponentType } from "react";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  wait,
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
  domDescriptionFieldId,
  domSubmitServerErrorsId,
  domSubmitServerErrorTextId,
  domCloseModalBtnId,
  domTitleFieldId,
} from "../components/CreateUpdateCloneResume/create-update-clone-resume.dom-selectors";
import { fillField } from "./test_utils";
import {
  UpdateResumeMinimalMutationFnOptions,
  UpdateResumeMinimalExecutionResult,
} from "../graphql/apollo/update-resume.mutation";
import {
  UpdateResumeMinimalVariables,
  UpdateResumeMinimal_updateResumeMinimal_ResumeSuccess_resume,
} from "../graphql/apollo-types/UpdateResumeMinimal";
import { act } from "react-dom/test-utils";
import { domFieldSuccessClass } from "../components/components.utils";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

describe("component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    cleanup();
  });

  it("update resume: successful", async () => {
    const resolvedValue: UpdateResumeMinimalExecutionResult = {
      data: {
        updateResumeMinimal: {
          __typename: "ResumeSuccess",
          resume: {
            id: "a",
            title: "tb",
            description: "db",
          } as UpdateResumeMinimal_updateResumeMinimal_ResumeSuccess_resume,
        },
      },
    };

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

    mockUpdateResume.mockResolvedValue(resolvedValue);

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

  it("update resume: server title error, description success", async () => {
    const resolvedValue: UpdateResumeMinimalExecutionResult = {
      data: {
        updateResumeMinimal: {
          __typename: "UpdateResumeErrors",
          errors: {
            __typename: "UpdateResumeErrorsFields",
            error: null,
            description: null,
            title: "a",
          },
        },
      },
    };

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

    mockUpdateResume.mockResolvedValue(resolvedValue);

    const {} = render(ui);

    /**
     * When we complete description field with new data
     */
    const domDescriptionInput = document.getElementById(
      domDescriptionInputId,
    ) as HTMLInputElement;

    fillField(domDescriptionInput, "db");

    /**
     * Then we should not see field success UI
     */
    const domDescriptionFieldContainer = document.getElementById(
      domDescriptionFieldId,
    ) as HTMLElement;

    expect(domDescriptionFieldContainer.classList).not.toContain(
      domFieldSuccessClass,
    );

    /**
     * When cursor is moved out of the field
     */
    fireEvent.blur(domDescriptionInput);

    /**
     * Then we should see field success UI
     */

    expect(domDescriptionFieldContainer.classList).toContain(
      domFieldSuccessClass,
    );

    /**
     * And we should not see submitting overlay UI
     */
    expect(document.getElementById(domSubmittingOverlayId)).toBeNull();

    /**
     * When we submit the form
     */

    (document.getElementById(domSubmitBtnId) as HTMLInputElement).click();

    /**
     * Then we should see loading indicator UI
     */
    expect(document.getElementById(domSubmittingOverlayId)).not.toBeNull();

    /**
     * And we should not see server error message
     */
    expect(document.getElementById(domSubmitServerErrorsId)).toBeNull();

    /**
     * And title field should not contain error
     */
    expect(document.getElementById(domTitleErrorId)).toBeNull();

    /**
     * After a while, we should see server error message
     */
    await waitForElement(() => {
      return document.getElementById(domSubmitServerErrorsId);
    });

    /**
     * And correct data should have been sent to the server
     */
    const callArgs = mockUpdateResume.mock
      .calls[0][0] as UpdateResumeMinimalMutationFnOptions;

    const expectedCallArgs: UpdateResumeMinimalVariables["input"] = {
      id: "a",
      description: "db",
    };

    expect((callArgs.variables as UpdateResumeMinimalVariables).input).toEqual(
      expectedCallArgs,
    );

    /**
     * And title field should contain error
     */
    expect(document.getElementById(domTitleErrorId)).not.toBeNull();

    /**
     * And description field should not contain error
     */
    expect(document.getElementById(domDescriptionErrorId)).toBeNull();
  });

  it("update resume: server description error, title success", async () => {
    const resolvedValue: UpdateResumeMinimalExecutionResult = {
      data: {
        updateResumeMinimal: {
          __typename: "UpdateResumeErrors",
          errors: {
            __typename: "UpdateResumeErrorsFields",
            error: null,
            description: "d",
            title: null,
          },
        },
      },
    };
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

    mockUpdateResume.mockResolvedValue(resolvedValue);

    const {} = render(ui);

    /**
     * When we complete title field with new data
     */
    const domTitleInput = document.getElementById(
      domTitleInputId,
    ) as HTMLInputElement;

    fillField(domTitleInput, "db");

    /**
     * Then we should not see field success UI
     */
    const domTitleFieldContainer = document.getElementById(
      domTitleFieldId,
    ) as HTMLElement;

    expect(domTitleFieldContainer.classList).not.toContain(
      domFieldSuccessClass,
    );

    /**
     * When cursor is moved out of the field
     */
    fireEvent.blur(domTitleInput);

    /**
     * Then we should see field success UI
     */

    expect(domTitleFieldContainer.classList).toContain(domFieldSuccessClass);

    /**
     * When we submit the form
     */

    (document.getElementById(domSubmitBtnId) as HTMLInputElement).click();

    /**
     * Then description field should not contain error
     */
    expect(document.getElementById(domDescriptionErrorId)).toBeNull();

    /**
     * But after a while, description field should contain error
     */
    await wait(() => true);
    expect(document.getElementById(domDescriptionErrorId)).not.toBeNull();

    /**
     * And title field should not contain error
     */
    expect(document.getElementById(domTitleErrorId)).toBeNull();
  });

  it("update resume: server generic error", async () => {
    const resolvedValue: UpdateResumeMinimalExecutionResult = {
      data: {
        updateResumeMinimal: {
          __typename: "UpdateResumeErrors",
          errors: {
            __typename: "UpdateResumeErrorsFields",
            error: "e",
            description: null,
            title: null,
          },
        },
      },
    };

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

    mockUpdateResume.mockResolvedValue(resolvedValue);

    const {} = render(ui);

    /**
     * When we complete description field with new data
     */

    fillField(
      document.getElementById(domDescriptionInputId) as HTMLInputElement,
      "db",
    );

    /**
     * Then we should not see server generic error
     */
    expect(document.getElementById(domSubmitServerErrorTextId)).toBeNull();

    /**
     * When we submit the form
     */

    (document.getElementById(domSubmitBtnId) as HTMLInputElement).click();

    await wait(() => true);

    /**
     * Then we should see server generic error
     */
    expect(document.getElementById(domSubmitServerErrorTextId)).not.toBeNull();

    /**
     * And form fields should not contain errors
     */
    expect(document.getElementById(domDescriptionErrorId)).toBeNull();
    expect(document.getElementById(domTitleErrorId)).toBeNull();
  });

  it("update resume: server unexpected error", async () => {
    /**
     * Given that we are using the component
     */
    const { ui } = makeComp({
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
     * When we complete description field with new data
     */

    fillField(
      document.getElementById(domDescriptionInputId) as HTMLInputElement,
      "db",
    );

    /**
     * Then we should not see server generic error
     */
    expect(document.getElementById(domSubmitServerErrorTextId)).toBeNull();

    /**
     * When we submit the form
     */

    (document.getElementById(domSubmitBtnId) as HTMLInputElement).click();

    await wait(() => true);

    /**
     * Then we should see server generic error
     */
    expect(document.getElementById(domSubmitServerErrorTextId)).not.toBeNull();
  });

  it("update resume: apollo error, close modal", async () => {
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

    mockUpdateResume.mockRejectedValue(
      new ApolloError({
        graphQLErrors: [new GraphQLError("a")],
      }),
    );

    const {} = render(ui);

    /**
     * When we complete description field with new data
     */

    fillField(
      document.getElementById(domDescriptionInputId) as HTMLInputElement,
      "db",
    );

    /**
     * Then we should not see server errors
     */
    expect(document.getElementById(domSubmitServerErrorTextId)).toBeNull();

    /**
     * When we submit the form
     */

    (document.getElementById(domSubmitBtnId) as HTMLInputElement).click();

    await wait(() => true);

    /**
     * Then we should see server errors
     */
    expect(document.getElementById(domSubmitServerErrorTextId)).not.toBeNull();

    /**
     * And component should still be visible
     */
    expect(document.getElementById(domDescriptionInputId)).not.toBeNull();

    /**
     * When we dismiss the component
     */
    (document.getElementById(domCloseModalBtnId) as HTMLElement).click();

    /**
     * Then component should no longer be visible
     */
    expect(document.getElementById(domDescriptionInputId)).toBeNull();
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
