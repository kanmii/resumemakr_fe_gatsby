import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  act
} from "react-testing-library";
import { ApolloError } from "apollo-client";

import { Home } from "../components/Home/home-x";
import {
  fillField,
  WithData,
  renderWithApollo,
  renderWithRouter
} from "./test_utils";
import { makeResumeRoute } from "../routing";
import { Props, ResumeTitlesProps } from "../components/Home/home";
import { CreateResume } from "../graphql/apollo/types/CreateResume";
import { CloneResume } from "../graphql/apollo/types/CloneResume";
import { ResumeTitles_listResumes } from "../graphql/apollo/types/ResumeTitles";
import { DeleteResume } from "../graphql/apollo/types/DeleteResume";
import { ErstellenLebenslaufFnArgs } from "../graphql/apollo/create-resume.mutation";
import { CloneLebensLaufFnArgs } from "../graphql/apollo/clone-resume.mutation";
import { ResumeTitlesProps as RTP } from "../graphql/apollo/resume-titles.query";
import { RouteComponentProps } from "@reach/router";

const HomeP = Home as React.FunctionComponent<Partial<Props>>;

it("renders loading indicator", () => {
  /**
   * Given a user is on the home page
   */
  const { Ui } = setUp();

  const { getByTestId, queryByText, rerender, queryByTestId } = render(
    <Ui {...resumeTitlesGql({ loading: true })} />
  );

  /**
   * She sees the loading indicator
   */
  expect(getByTestId("loading resume titles")).toBeInTheDocument();

  /**
   * But she does not see the add new button
   */
  expect(queryByText("+")).not.toBeInTheDocument();

  rerender(<Ui {...resumeTitlesGql({ loading: false })} />);

  /**
   * And she sees that loading indicator is gone
   */
  expect(queryByTestId("loading resume titles")).not.toBeInTheDocument();
});

it("renders error", () => {
  const error = {
    message: "Failed to fetch"
  } as ApolloError;

  /**
   * Given a user is on the home page
   */
  const { Ui } = setUp();
  const { queryByTestId, getByText } = render(
    <Ui {...resumeTitlesGql({ error })} />
  );

  /**
   * She sees no loading indicator on the page
   */
  expect(queryByTestId("loading resume titles")).not.toBeInTheDocument();

  /**
   * And she sees an error message
   */

  expect(getByText(error.message)).toBeInTheDocument();
});

it("renders message if user has not created resume", () => {
  /**
   * Given a user has not created any resumes previously
   */
  const resumes = {
    edges: [],
    __typename: "ResumeConnection"
  } as ResumeTitles_listResumes;

  /**
   * When she navigates to the home page
   */
  const { Ui } = setUp();

  const { getByText, queryByText } = render(
    <Ui {...resumeTitlesGql({ listResumes: resumes })} />
  );

  /**
   * Sie kann nicht ein Nachricht "erstellen neue lebenslauf" sehen
   */
  expect(queryByText(/Create new resume/)).not.toBeInTheDocument();

  /**
   * Und sieht sie ein Nachricht that she has not created any resumes previously
   */
  const $noResumes = getByText(/You have no resumes/i);

  /**
   * When she clicks on this message
   */
  fireEvent.click($noResumes);

  /**
   * Then she sees a UI asking her to create a new resume
   */
  expect(getByText(/Create new resume/)).toBeInTheDocument();
});

it("renders resume titles", () => {
  /**
   * Given a user has resumes in the system
   */
  const titles = ["My awesome title 1", "My awesome title 2"];

  const resumes = {
    edges: [
      {
        node: {
          title: titles[0],
          id: "1"
        }
      },

      {
        node: {
          title: titles[1],
          id: "2"
        }
      }
    ]
  } as ResumeTitles_listResumes;

  /**
   * When she visits the home page
   */

  const { Ui, mockNavigate } = setUp();

  const { getByText } = render(
    <Ui {...resumeTitlesGql({ listResumes: resumes })} />
  );

  /**
   * Then she should see her resumes' titles
   */
  titles.forEach(t => expect(getByText(t)).toBeInTheDocument());

  /**
   * When she clicks on the second title
   */
  fireEvent.click(getByText(titles[1]));

  /**
   * Then she is redirected to page to edit the resume
   */
  expect(mockNavigate).toBeCalledWith(makeResumeRoute(titles[1]));
});

it("creates resume", async () => {
  const title = "my awesome resume";

  const result = {
    data: {
      createResume: {
        resume: {
          title
        }
      }
    }
  } as WithData<CreateResume>;

  const mockCreateResume = jest.fn<
    Promise<WithData<CreateResume>>,
    [ErstellenLebenslaufFnArgs | undefined]
  >(() => Promise.resolve(result));

  const { Ui, mockNavigate } = setUp();

  /**
   * Given that a user is on the home page
   */
  const { getByLabelText, queryByLabelText, getByText, queryByText } = render(
    <Ui
      createResume={mockCreateResume}
      {...resumeTitlesGql({
        listResumes: { edges: [], __typename: "ResumeConnection" }
      })}
    />
  );

  /**
   * Sieht sie dass es gibt kein Elemente mit Wortlaut "+"
   */
  expect(queryByText("+")).not.toBeInTheDocument();

  /**
   * She sees there is no UI with text "Title e.g. name of company to send to"
   */
  expect(
    queryByLabelText(/Title e.g. name of company to send to/)
  ).not.toBeInTheDocument();

  /**
   * When she clicks on new button
   */
  fireEvent.click(getByText(/You have no resumes/));

  /**
   * And fills the field labelled "Title e.g. name of company to send to" with resume title
   */
  fillField(getByLabelText(/Title e.g. name of company to send to/), title);

  /**
   * And clicks on the yes button
   */
  fireEvent.click(getByText("Yes"));

  /**
   * She is redirected to the page where she can fill her resume
   */
  await wait(() => {
    const args = mockCreateResume.mock.calls[0][0] as ErstellenLebenslaufFnArgs;
    expect(args.variables && args.variables.input.title).toBe(title);
  });

  expect(mockNavigate).toBeCalledWith(makeResumeRoute(title));
});

it("renders error if deleteResume prop not injected", async () => {
  /**
   * Given there are resumes in the system
   */

  const resumes = {
    edges: [
      {
        node: {
          title: "Title 1",
          id: "1"
        }
      }
    ],
    __typename: "ResumeConnection"
  } as ResumeTitles_listResumes;

  /**
   * When a user visits the home page
   */
  const { Ui } = setUp();

  const { getByText, queryByText, getByTestId } = render(
    <Ui {...resumeTitlesGql({ listResumes: resumes })} />
  );

  /**
   * Then she sees no UI showing resume can not be deleted
   */
  expect(queryByText(/unable to delete resume/i)).not.toBeInTheDocument();

  /**
   * When she deletes one of the displayed resume titles
   */
  fireEvent.click(getByText(/delete title 1/i));
  fireEvent.click(getByTestId("yes to delete Title 1"));

  /**
   * Then she sees an error UI saying the resume can not be deleted
   */
  expect(getByText(/unable to delete resume/i)).toBeInTheDocument();
});

it("deletes resume", async () => {
  /**
   * Given there are resumes in the system
   */

  const titles = ["My awesome title 1", "My awesome title 2"];

  const resumes = {
    edges: [
      {
        node: {
          title: titles[0],
          id: "1"
        }
      },

      {
        node: {
          title: titles[1],
          id: "2"
        }
      }
    ]
  } as ResumeTitles_listResumes;

  /**
   * When a user visits the home page
   */

  const result = {
    data: {
      deleteResume: {
        resume: {
          id: "2",
          title: titles[1]
        }
      }
    }
  } as WithData<DeleteResume>;

  const deleteResume = jest.fn(() => Promise.resolve(result));

  const { Ui } = setUp();

  const { getByText, queryByText, getByTestId } = render(
    <Ui
      {...resumeTitlesGql({ listResumes: resumes })}
      deleteResume={deleteResume}
    />
  );

  const successRegexp = new RegExp(`deleted successfully`, "i");
  const confirmRegexp = new RegExp(`Sure to delete`, "i");

  /**
   * She sees one of her resumes' title on the page
   */
  expect(getByTestId(`${titles[1]} row`)).toBeInTheDocument();

  /**
   * And she sees no UI asking her to confirm if she wants to delete resume
   */
  expect(queryByText(confirmRegexp)).not.toBeInTheDocument();

  /**
   * When she clicks to delete one of the displayed resume titles
   */
  fireEvent.click(getByText(new RegExp(`delete ${titles[1]}`, "i")));

  /**
   * Then she sees UI asking her to confirm if she wants to delete resume
   */
  expect(getByText(confirmRegexp)).toBeInTheDocument();

  /**
   * When she clicks on 'no she does not want to delete resume'
   */
  fireEvent.click(getByTestId(`no to delete ${titles[1]}`));

  /**
   * Then she sees the UI asking her to confirm if she wants to delete resume
   * is gone
   */
  expect(queryByText(confirmRegexp)).not.toBeInTheDocument();

  /**
   * When she clicks to delete one of the displayed resume titles
   */
  fireEvent.click(getByText(new RegExp(`delete ${titles[1]}`, "i")));

  /**
   * Then she sees no UI showing resume has been deleted
   */
  expect(queryByText(successRegexp)).not.toBeInTheDocument();

  /**
   * When she confirms to delete resume
   */

  act(() => {
    fireEvent.click(getByTestId(`yes to delete ${titles[1]}`));
  });

  /**
   * Then she sees a UI showing her action succeeded
   */

  const $successMsg = await waitForElement(() => getByText(successRegexp));

  expect($successMsg).toBeInTheDocument();

  /**
   * When she clicks on the success message
   */
  fireEvent.click($successMsg);

  /**
   * Then she sees that the message has disappeared
   */
  expect(queryByText(successRegexp)).not.toBeInTheDocument();
});

it("clones resume", async () => {
  const clonedTitle = "My awesome title cloned";

  const result = {
    data: {
      cloneResume: {
        resume: {
          title: clonedTitle
        }
      }
    }
  } as WithData<CloneResume>;

  const mockCloneResume = jest.fn<
    Promise<WithData<CloneResume>>,
    [CloneLebensLaufFnArgs | undefined]
  >(() => Promise.resolve(result));

  /**
   * Given there is resume in the system
   */

  const title = "My awesome title 1";

  const resumes = {
    edges: [
      {
        node: {
          title,
          id: "1"
        }
      }
    ]
  } as ResumeTitles_listResumes;

  /**
   * When a user visits the home page
   */

  const { Ui, mockNavigate } = setUp();
  const { queryByText, getByText, getByLabelText } = render(
    <Ui
      {...resumeTitlesGql({ listResumes: resumes })}
      cloneResume={mockCloneResume}
    />
  );

  /**
   * Then she sees there is no message asking if she wants to clone resume
   */
  const cloneQuestion = /Clone from: /i;

  expect(queryByText(cloneQuestion)).not.toBeInTheDocument();

  /**
   * When she clicks on the clone button
   */
  fireEvent.click(getByText(new RegExp(`clone ${title}`, "i")));

  /**
   * Then she sees a message asking if she wants to clone resume
   */

  expect(getByText(cloneQuestion)).toBeInTheDocument();

  /**
   * And sees that the title field is pre-filled with title she clicked on
   */
  const $input = getByLabelText("Title e.g. name of company to send to");
  expect($input.getAttribute("value")).toBe(title);

  /**
   * When she fills the title field with new title
   */
  fillField($input, clonedTitle);

  /**
   * And clicks on the yes button
   */
  fireEvent.click(getByText("Yes"));

  /**
   * She is redirected to the page where she can continue filling her resume
   */
  await wait(() => {
    const args = mockCloneResume.mock.calls[0][0] as CloneLebensLaufFnArgs;
    expect(args.variables && args.variables.input.title).toBe(clonedTitle);
  });

  expect(mockNavigate).toBeCalledWith(makeResumeRoute(clonedTitle));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function setUp(props: Partial<RouteComponentProps> = {}) {
  const { Ui: ui, ...routerProps } = renderWithRouter(HomeP, props);
  const { Ui, ...apollo } = renderWithApollo(ui);

  return { Ui, ...apollo, ...routerProps };
}

function resumeTitlesGql(params: Partial<RTP>): ResumeTitlesProps {
  return {
    resumeTitlesGql: params as RTP
  };
}
