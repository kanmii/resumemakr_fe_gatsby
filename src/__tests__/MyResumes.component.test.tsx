/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  render,
  wait,
  waitForElement,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import { ApolloError } from "apollo-client";
import { MyResumes } from "../components/MyResumes/my-resumes.component";
import {
  fillField,
  WithData,
  renderWithApollo,
  renderWithRouter,
} from "./test_utils";
import { makeResumeRoute } from "../routing";
import { Props } from "../components/MyResumes/my-resumes.utils";
import { CreateResume } from "../graphql/apollo-types/CreateResume";
import { CloneResume } from "../graphql/apollo-types/CloneResume";
import {
  ResumeTitles_listResumes,
  ResumeTitles_listResumes_edges,
} from "../graphql/apollo-types/ResumeTitles";
import { DeleteResume } from "../graphql/apollo-types/DeleteResume";
import { ListResumesProps } from "../graphql/apollo/resume-titles.query";
import {
  triggerCreateNewResumeId,
  dataLoadingErrorId,
  noResumesMsgId,
  createNewResumeId,
  makeGoToEditResumeId,
  titleInputId,
  createNewResumeSubmitBtnId,
  deleteSuccessMsgId,
  confirmDeleteMsgId,
  makeDeleteId,
  makeNoConfirmDeleteId,
  makeYesConfirmDeleteId,
  createClonedResumeId,
  makeTriggerCloneId,
  makeShowUpdateResumeUITriggerBtnId,
  makeResumeRowTitleContainerId,
} from "../components/MyResumes/my-resumes.dom-selectors";
import {
  Mode,
  Props as CreateUpdateCloneResumeProps,
} from "../components/CreateUpdateCloneResume/create-update-clone-resume.utils";

jest.mock("../components/Header/header.index", () => ({
  Header: jest.fn(() => null),
}));

const mockLoadingId = "lolo";
jest.mock("../components/Loading/loading.component", () => ({
  Loading: () => <div id={mockLoadingId} />,
}));

jest.mock("../graphql/apollo/create-resume.mutation");

jest.mock(
  "../components/CreateUpdateCloneResume/create-update-clone-resume.index",
  () => (props: CreateUpdateCloneResumeProps) => {
    return <div id={props.mode} onClick={props.onClose} />;
  },
);

describe("component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders loading indicator", () => {
    /**
     * Given a user is on the home page
     */
    const { ui } = setUp({
      ...resumeTitlesGql({ loading: true }),
    });

    render(ui);

    /**
     * She sees the loading indicator
     */
    expect(document.getElementById(mockLoadingId)).not.toBeNull();

    /**
     * But she does not see the add new button
     */
    expect(document.getElementById(triggerCreateNewResumeId)).toBeNull();
  });

  it("renders error", () => {
    /**
     * Given a user is on the home page
     */
    const { ui } = setUp({
      ...resumeTitlesGql({
        error: {
          message: "Failed to fetch",
        } as ApolloError,
      }),
    });

    render(ui);

    /**
     * She sees no loading indicator on the page
     */
    expect(document.getElementById(mockLoadingId)).toBeNull();

    /**
     * And she sees an error message
     */

    expect(document.getElementById(dataLoadingErrorId)).not.toBeNull();
  });

  it("renders message if user has not created resume", () => {
    /**
     * Given a user has not created any resumes previously
     */
    const resumes = {
      edges: [] as ResumeTitles_listResumes_edges[],
    } as ResumeTitles_listResumes;

    /**
     * When she navigates to the home page
     */
    const { ui } = setUp({
      ...resumeTitlesGql({
        data: {
          listResumes: resumes,
        },
      }),
    });

    render(ui);

    /**
     * Sie kann nicht ein Nachricht "erstellen neue lebenslauf" sehen
     */
    expect(document.getElementById(createNewResumeId)).toBeNull();

    /**
     * Und sieht sie ein Nachricht that she has not created any resumes previously
     * And when she clicks on this message
     */
    (document.getElementById(noResumesMsgId) as HTMLElement).click();

    /**
     * Then she sees a UI asking her to create a new resume
     */
    expect(document.getElementById(createNewResumeId)).not.toBeNull();
  });

  it("renders resume titles", () => {
    /**
     * Given a user has resumes in the system
     */

    const resumes = {
      edges: [
        {
          node: {
            title: "t1",
            id: "1",
          },
        },
      ],
    } as ResumeTitles_listResumes;

    /**
     * When she visits the home page
     */

    const { ui, mockNavigate } = setUp({
      ...resumeTitlesGql({
        data: {
          listResumes: resumes,
        },
      }),
    });

    render(ui);

    /**
     * When she clicks on the title
     */
    (document.getElementById(makeGoToEditResumeId(1)) as HTMLElement).click();

    /**
     * Then she is redirected to page to edit the resume
     */
    expect(mockNavigate).toBeCalledWith(makeResumeRoute("t1"));
  });

  it("creates resume", async () => {
    const title = "tt";

    const result = {
      data: {
        createResume: {
          resume: {
            title,
          },
        },
      },
    } as WithData<CreateResume>;

    const { ui, mockNavigate, mockCreateResume } = setUp({
      ...resumeTitlesGql({}),
    });

    mockCreateResume.mockResolvedValue(result);

    /**
     * Given that a user is on the home page
     */
    render(ui);

    /**
     * Sieht sie dass es gibt kein Elemente mit Wortlaut "+"
     */
    expect(document.getElementById(triggerCreateNewResumeId)).toBeNull();

    /**
     * She sees there is no UI with text "Title e.g. name of company to send to"
     */
    expect(document.getElementById(titleInputId)).toBeNull();

    /**
     * When she clicks on new button
     */
    (document.getElementById(noResumesMsgId) as HTMLElement).click();
    /**
     * And fills the field labelled "Title e.g. name of company to send to" with resume title
     */
    fillField(document.getElementById(titleInputId) as HTMLElement, title);

    /**
     * And clicks on the yes button
     */
    (document.getElementById(
      createNewResumeSubmitBtnId,
    ) as HTMLElement).click();

    /**
     * She is redirected to the page where she can fill her resume
     */
    await wait(() => {
      expect(
        (mockCreateResume.mock.calls[0][0] as any).variables.input.title,
      ).toBe(title);
    });

    expect(mockNavigate).toBeCalledWith(makeResumeRoute(title));
  });

  it("deletes resume", async () => {
    /**
     * Given there are resumes in the system
     */

    const resumes = {
      edges: [
        {
          node: {
            title: "t1",
            id: "1",
          },
        },

        {
          node: {
            title: "t2",
            id: "2",
          },
        },
      ],
    } as ResumeTitles_listResumes;

    /**
     * When a user visits the home page
     */

    const result = {
      data: {
        deleteResume: {
          resume: {
            id: "2",
            title: "t2",
          },
        },
      },
    } as WithData<DeleteResume>;

    const { ui, mockDeleteResume } = setUp({
      ...resumeTitlesGql({
        data: {
          listResumes: resumes,
        },
      }),
    });

    mockDeleteResume.mockResolvedValue(result);

    render(ui);

    /**
     * Then she sees no UI asking her to confirm if she wants to delete resume
     */
    expect(document.getElementById(confirmDeleteMsgId)).toBeNull();

    /**
     * When she clicks to delete one of the displayed resume titles
     */

    (document.getElementById(makeDeleteId(1)) as HTMLElement).click();

    /**
     * Then she sees UI asking her to confirm if she wants to delete resume
     */
    expect(document.getElementById(
      confirmDeleteMsgId,
    ) as HTMLElement).not.toBeNull();

    /**
     * When user does not wish to delete resume
     */
    (document.getElementById(makeNoConfirmDeleteId(1)) as HTMLElement).click();

    /**
     * Then she sees the UI asking her to confirm if she wants to delete resume
     * is gone
     */
    expect(document.getElementById(
      confirmDeleteMsgId,
    ) as HTMLElement).toBeNull();

    /**
     * When she clicks to delete one of the displayed resume titles and confirms
     */
    (document.getElementById(makeDeleteId(1)) as HTMLElement).click();
    (document.getElementById(makeYesConfirmDeleteId(1)) as HTMLElement).click();

    /**
     * Then we see UI confirming action succeeded
     */

    const $success = await waitForElement(() => {
      return document.getElementById(deleteSuccessMsgId) as HTMLElement;
    });

    /**
     * When we click on UI showing action succeeded
     */
    $success.click();

    /**
     * Then we see that the message has disappeared
     */
    expect(document.getElementById(
      deleteSuccessMsgId,
    ) as HTMLElement).toBeNull();

    /**
     * And
     */
  });

  it("clones resume", async () => {
    const clonedTitle = "t2";

    const result = {
      data: {
        cloneResume: {
          resume: {
            title: clonedTitle,
          },
        },
      },
    } as WithData<CloneResume>;

    /**
     * Given there is resume in the system
     */

    const title = "t1";

    const resumes = {
      edges: [
        {
          node: {
            title,
            id: "1",
          },
        },
      ],
    } as ResumeTitles_listResumes;

    /**
     * When a user visits the home page
     */

    const { ui, mockNavigate, mockCloneResume } = setUp({
      ...resumeTitlesGql({
        data: {
          listResumes: resumes,
        },
      }),
    });

    mockCloneResume.mockResolvedValue(result);

    render(ui);

    /**
     * Then she sees there is no message asking if she wants to clone resume
     */

    expect(document.getElementById(createClonedResumeId)).toBeNull();

    /**
     * When she clicks on the clone button
     */
    (document.getElementById(makeTriggerCloneId(1)) as HTMLElement).click();

    /**
     * Then she sees a message asking if she wants to clone resume
     */

    expect(document.getElementById(createClonedResumeId)).not.toBeNull();

    /**
     * And sees that the title field is pre-filled with title she clicked on
     */
    const $input = document.getElementById(titleInputId) as HTMLInputElement;
    expect($input.getAttribute("value")).toBe(title);

    /**
     * When she fills the title field with new title
     */
    fillField($input, clonedTitle);

    /**
     * And clicks on the yes button
     */
    (document.getElementById(
      createNewResumeSubmitBtnId,
    ) as HTMLElement).click();

    /**
     * She is redirected to the page where she can continue filling her resume
     */
    await wait(() => {
      expect(
        (mockCloneResume.mock.calls[0][0] as any).variables.input.title,
      ).toBe(clonedTitle);
    });

    expect(mockNavigate).toBeCalledWith(makeResumeRoute(clonedTitle));
  });

  it("shows update resume UI when triggerred", () => {
    /**
     * Given there are 2 resumes in the system
     */

    const { ui } = setUp(
      resumeTitlesGql({
        data: {
          listResumes: {
            edges: [
              {
                node: {
                  id: "a",
                  title: "a",
                },
              },
              {
                node: {
                  id: "b",
                  title: "b",
                },
              },
            ],
          } as ResumeTitles_listResumes,
        },
      }),
    );

    /**
     * When we use the component
     */
    render(ui);

    /**
     * Then we should see the 2 resumes
     */

    expect(document.getElementById(makeResumeRowTitleContainerId("b"))).not.toBeNull();

    const domResumeRowTitle = document.getElementById(
      makeResumeRowTitleContainerId("a"),
    ) as HTMLElement;

    /**
     * And we should not see UI to trigger update resume UI
     */
    expect(
      document.getElementById(makeShowUpdateResumeUITriggerBtnId("a")),
    ).toBeNull();

    /**
     * When we hover the resume title
     */
    fireEvent.mouseEnter(domResumeRowTitle);

    /**
     * Then we should see button which when clicked shows update resume UI
     */
    expect(
      document.getElementById(makeShowUpdateResumeUITriggerBtnId("a")),
    ).not.toBeNull();

    /**
     * But we should not see similar button for other resumes
     */
    expect(
      document.getElementById(makeShowUpdateResumeUITriggerBtnId("b")),
    ).toBeNull();

    /**
     * But when we move the mouse out of the resume title
     */
    fireEvent.mouseOut(domResumeRowTitle);

    /**
     * Then we should no longer see button which when clicked shows update
     * resume UI
     */
    expect(
      document.getElementById(makeShowUpdateResumeUITriggerBtnId("a")),
    ).toBeNull();

    /**
     * When we click on the resume title
     */
    domResumeRowTitle.click();

    /**
     * Then we should see button which when clicked shows update resume UI
     */

    const domUpdateTrigger = document.getElementById(
      makeShowUpdateResumeUITriggerBtnId("a"),
    ) as HTMLElement;

    /**
     * And we should not see UI to update resume
     */
    expect(document.getElementById(Mode.update)).toBeNull();

    /**
     * When we click on update resume button
     */
    domUpdateTrigger.click();

    /**
     * Then we should see UI from which resume can be updated
     */
    const domUpdateUi = document.getElementById(Mode.update) as HTMLElement;

    /**
     * When we close Update Resume UI
     */
    domUpdateUi.click();

    /**
     * Then we should not longer see UpdateResume UI
     */
    expect(document.getElementById(Mode.update)).toBeNull();

    /**
     * And we should not see UI to trigger update resume UI
     */
    expect(
      document.getElementById(makeShowUpdateResumeUITriggerBtnId("a")),
    ).toBeNull();
  });
});

////////////////////////// HELPER FUNCTIONS ///////////////////////////////////

const MyResumesP = MyResumes as React.FunctionComponent<Partial<Props>>;

function setUp(props: Partial<Props> = resumeTitlesGql()) {
  const mockCreateResume = jest.fn();
  const mockDeleteResume = jest.fn();
  const mockCloneResume = jest.fn();
  props.createResume = mockCreateResume;
  props.deleteResume = mockDeleteResume;
  props.cloneResume = mockCloneResume;

  const { Ui: ui, ...routerProps } = renderWithRouter(MyResumesP, props);
  const { Ui, ...apollo } = renderWithApollo(ui);

  return {
    ui: <Ui />,
    ...apollo,
    ...routerProps,
    mockCreateResume,
    mockDeleteResume,
    mockCloneResume,
  };
}

function resumeTitlesGql(
  params: Partial<ListResumesProps["resumeTitlesGql"]> = {},
): ListResumesProps {
  return {
    resumeTitlesGql: params as ListResumesProps["resumeTitlesGql"],
  };
}
