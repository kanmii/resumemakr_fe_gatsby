import React, { useState, useRef, useEffect, useReducer } from "react";
import { Button, Label, Icon, Popup } from "semantic-ui-react";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";
import { MutationUpdaterFn, ApolloError } from "apollo-client";
import dateFormat from "date-fns/format";
import { Formik, FastField, FormikProps, FormikErrors } from "formik";
import lodashIsEmpty from "lodash/isEmpty";
import { NavigateFn } from "@reach/router";
import "./styles.scss";
import {
  ResumeTitles,
  ResumeTitlesVariables,
  ResumeTitles_listResumes_edges_node,
  ResumeTitles_listResumes_edges,
} from "../../graphql/apollo-types/ResumeTitles";
import { CreateResumeInput } from "../../graphql/apollo-types/globalTypes";
import { DeleteResume } from "../../graphql/apollo-types/DeleteResume";
import { CircularLabel } from "../CircularLabel";
import { makeResumeRoute } from "../../routing";
import {
  Props,
  validationSchema,
  ActionType,
  emptyVal,
  uiTexts,
  reducer,
  initState,
} from "./my-resumes.utils";
import { Loading } from "../Loading/loading.component";
import { initialFormValues } from "../UpdateResumeForm/update-resume.utils";
import { Mode as PreviewMode } from "../Preview/preview.utils";
import { AutoTextarea } from "../AutoTextarea";
import { AppModal } from "../AppModal/app-modal.component";
import { makeSiteTitle, setDocumentTitle } from "../../constants";
import { Header } from "../Header/header.index";
import { DeleteResumeMutationFn } from "../../graphql/apollo/delete-resume.mutation";
import {
  triggerCreateNewResumeId,
  dataLoadingErrorId,
  noResumesMsgId,
  createNewResumeId,
  makeResumeRowId,
  makeGoToEditResumeId,
  titleInputId,
  makeYesConfirmDeleteId,
  createNewResumeSubmitBtnId,
  deleteSuccessMsgId,
  confirmDeleteMsgId,
  makeDeleteId,
  makeNoConfirmDeleteId,
  createClonedResumeId,
  makeTriggerCloneId,
  descriptionInputId,
  makeShowUpdateResumeUITriggerBtnId,
  makeResumeRowTitleContainerId,
  domUpdateUITriggerClassname,
  domRowTitleClass,
  makeResumeRowTitleId,
} from "./my-resumes.dom-selectors";
import { RESUME_QUERY_APOLLO_CACHE_FN_ARGS } from "../../graphql/apollo/resume-titles.query";
import CreateUpdateCloneResume from "../CreateUpdateCloneResume/create-update-clone-resume.index";
import { Mode } from "../CreateUpdateCloneResume/create-update-clone-resume.utils";

let initialValues = emptyVal;
let action = ActionType.createResume;
let idToClone = "0";
let titleToClone = "";

export function MyResumes(props: Props) {
  const {
    navigate,
    deleteResume,
    resumeTitlesGql: { loading, error, data },
    createResume,
    cloneResume,
  } = props;
  const edges = data && data.listResumes && data.listResumes.edges;
  const [stateMachine, dispatch] = useReducer(reducer, props, initState);
  const createUpdateCloneState = stateMachine.createUpdateClone;

  const [offnenModal, einstellenOffnenModal] = useState(false);

  const [bestatigenLoschenId, einstellenBestatigenLoschenId] = useState<
    string | undefined
  >(undefined);

  const [loschenFehler, einstellenLoschenFehler] = useState<
    | undefined
    | {
        id: string;
        errors: string[];
      }
  >(undefined);

  const [lebenslaufGeloscht, einstellenLebenslaufGeloscht] = useState<
    string | undefined
  >(undefined);

  const [geloschtLebenslauf, einstellenGeloschtLebenslauf] = useState<
    string | undefined
  >(undefined);

  const [formularFehler, einstellenFormularFehler] = useState<
    undefined | FormikErrors<CreateResumeInput>
  >(undefined);

  const [gqlFehler, einstellenGqlFehler] = useState<undefined | ApolloError>(
    undefined,
  );

  const deleteTriggerRefs = useRef<{ id?: undefined | HTMLElement }>({});

  useEffect(() => {
    setDocumentTitle(makeSiteTitle("My Resumes"));

    return setDocumentTitle;
  }, []);

  function handleConfirmDeletePopup() {
    einstellenBestatigenLoschenId(undefined);
  }

  function setConfirmDeleteTriggerRef(id: string) {
    return function(ref: HTMLElement) {
      deleteTriggerRefs.current[id] = ref;
    };
  }

  function openModal() {
    einstellenOffnenModal(true);
    einstellenFormularFehler(undefined);
  }

  function openModalForCreate() {
    initialValues = emptyVal;
    action = ActionType.createResume;
    openModal();
  }

  function goToResume(title: string) {
    (navigate as NavigateFn)(makeResumeRoute(title));
  }

  function handleDeleteErrorPopup() {
    einstellenLoschenFehler(undefined);
  }

  function erstellenResume({
    values,
    validateForm,
  }: FormikProps<CreateResumeInput>) {
    return async function erstellenResumeDrinnen() {
      einstellenFormularFehler(undefined);

      const errors = await validateForm(values);

      if (!lodashIsEmpty(errors)) {
        einstellenFormularFehler(errors);
        return;
      }

      let input;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      let fun: any;
      let path;

      if (action === ActionType.createResume) {
        input = { ...initialFormValues, ...values };

        fun = createResume;
        path = "createResume";
      } else {
        input = { ...values, id: idToClone };
        fun = cloneResume;
        path = "cloneResume";
      }

      try {
        const result = await fun({
          variables: {
            input,
          },
        });

        const resume =
          result &&
          result.data &&
          result.data[path] &&
          result.data[path].resume;

        if (!resume) {
          return;
        }

        goToResume(resume.title);
      } catch (error) {
        einstellenGqlFehler(error);
      }
    };
  }

  function herunterladenLebenslauf(title: string) {
    (navigate as NavigateFn)(
      makeResumeRoute(title, "") + "#" + PreviewMode.preview,
    );
  }

  async function loschenLebenslauf(id: string) {
    const result = await (deleteResume as DeleteResumeMutationFn)({
      variables: {
        input: { id },
      },

      /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
      update: updateAfterDelete,
    });

    const resume =
      result &&
      result.data &&
      result.data.deleteResume &&
      result.data.deleteResume.resume;

    if (!resume) {
      return;
    }

    einstellenLebenslaufGeloscht(id);

    setTimeout(() => {
      einstellenGeloschtLebenslauf(resume.title);
      einstellenLebenslaufGeloscht(undefined);
    });

    setTimeout(() => {
      einstellenGeloschtLebenslauf(undefined);
    }, 7000);
  }

  const updateAfterDelete: MutationUpdaterFn<DeleteResume> = function(
    cache,
    { data: newData },
  ) {
    if (!newData) {
      return;
    }

    const { deleteResume: resumeToBeRemoved } = newData;

    const readData = cache.readQuery<ResumeTitles, ResumeTitlesVariables>(
      RESUME_QUERY_APOLLO_CACHE_FN_ARGS,
    );

    const neueEdges =
      readData && readData.listResumes && readData.listResumes.edges;

    const resumeToBeRemovedId =
      (resumeToBeRemoved &&
        resumeToBeRemoved.resume &&
        resumeToBeRemoved.resume.id) ||
      "";

    cache.writeQuery<ResumeTitles, ResumeTitlesVariables>({
      ...RESUME_QUERY_APOLLO_CACHE_FN_ARGS,
      data: {
        listResumes: {
          edges: (neueEdges || []).filter(e => {
            return e && e.node && e.node.id !== resumeToBeRemovedId;
          }),

          __typename: "ResumeConnection",
        },
      },
    });
  };

  function rendernLoschenLebenslaufErfolgreichNachricht(nachricht?: string) {
    if (!nachricht) {
      return null;
    }

    return (
      <div
        id={deleteSuccessMsgId}
        className="deleted-resume-success"
        onClick={() => einstellenGeloschtLebenslauf(undefined)}
      >
        <div>
          <Label horizontal={true}>Dismiss</Label>
          <span
            style={{
              fontWeight: "bolder",
              marginRight: "5px",
            }}
          >
            {nachricht}
          </span>
          {uiTexts.deleteSuccessMsg}
        </div>
      </div>
    );
  }

  function renderModal() {
    return (
      <AppModal
        id={
          action === ActionType.createResume
            ? createNewResumeId
            : createClonedResumeId
        }
        open={offnenModal}
        onClose={() => einstellenOffnenModal(false)}
      >
        <Modal.Header>
          {action === ActionType.createResume
            ? "Create new resume"
            : `${uiTexts.cloneFromTitle} "${titleToClone}"?`}
        </Modal.Header>

        <Formik<CreateResumeInput>
          validationSchema={validationSchema}
          onSubmit={() => null}
          initialValues={initialValues}
          render={formikProps => {
            const titleError = (formularFehler && formularFehler.title) || "";

            return (
              <>
                <Modal.Content scrolling={true}>
                  {gqlFehler && gqlFehler.graphQLErrors[0].message}

                  <Modal.Description>
                    <div
                      className={`field home-form-field ${
                        titleError ? "error" : ""
                      }`}
                    >
                      <label htmlFor={titleInputId}>{uiTexts.form.title}</label>

                      <FastField
                        component={"input"}
                        id={titleInputId}
                        name="title"
                      />

                      {titleError && <div>{titleError}</div>}
                    </div>

                    <div
                      className="field home-form-field"
                      style={{ marginTop: "15px" }}
                    >
                      <label htmlFor={descriptionInputId}>
                        {uiTexts.form.description}
                        <span style={{ opacity: 0.6 }}> (optional)</span>
                      </label>

                      <FastField
                        component={AutoTextarea}
                        id={descriptionInputId}
                        name="description"
                        onTextChanged={(text: string) => {
                          formikProps.setFieldValue("description", text);
                        }}
                        value={formikProps.values.description || ""}
                        hiddenStyles={
                          { maxHeight: "400px" } as React.CSSProperties
                        }
                      />
                    </div>
                  </Modal.Description>
                </Modal.Content>

                <Modal.Actions>
                  <Button
                    type="button"
                    negative={true}
                    icon="remove"
                    labelPosition="right"
                    content={uiTexts.form.closeModalBtnText}
                    onClick={() => {
                      einstellenOffnenModal(false);
                    }}
                  />

                  <Button
                    id={createNewResumeSubmitBtnId}
                    type="button"
                    positive={true}
                    icon="checkmark"
                    labelPosition="right"
                    content={uiTexts.form.submitBtnText}
                    onClick={erstellenResume(formikProps)}
                  />
                </Modal.Actions>
              </>
            );
          }}
        />
      </AppModal>
    );
  }

  function renderTitles() {
    if (!(edges && edges.length)) {
      return (
        <a
          id={noResumesMsgId}
          className="no-resume"
          onClick={evt => {
            evt.preventDefault();
            openModalForCreate();
          }}
        >
          {uiTexts.noResumesMsg}
        </a>
      );
    }

    return (
      <div className="titles">
        {createUpdateCloneState.value === "opened" && (
          <CreateUpdateCloneResume
            mode={createUpdateCloneState.opened.context.mode}
            resume={createUpdateCloneState.opened.context.resume}
            onClose={() => {
              dispatch({
                type: ActionType.CREATE_UPDATE_CLONE_UI_CLOSED,
              });
            }}
          />
        )}

        <div className="header">
          <div>My resumes</div>

          {rendernLoschenLebenslaufErfolgreichNachricht(geloschtLebenslauf)}
        </div>

        <div className="columns">
          <div className="row header">
            <div className="title">Title</div>

            <div className="modified-date">Last modified</div>

            <div className="controls">Controls</div>
          </div>

          {edges.map(edge => {
            edge = edge as ResumeTitles_listResumes_edges;
            const node =
              edge && (edge.node as ResumeTitles_listResumes_edges_node);

            const { id, title, updatedAt, description } = node;

            return (
              <div id={makeResumeRowId(id)} className="row" key={id}>
                {lebenslaufGeloscht === id && (
                  <Loading data-testid={`deleting ${title}`} />
                )}

                <div className="controls">
                  <CircularLabel
                    color="teal"
                    onClick={() => {
                      initialValues = {
                        title,
                        description: description || "",
                      };

                      idToClone = id;
                      titleToClone = title;
                      action = ActionType.cloneResume;
                      openModal();
                    }}
                  >
                    <Icon name="copy outline" />

                    <span
                      id={makeTriggerCloneId(id)}
                      className="control-label-text"
                    >
                      {`clone ${title}`}
                    </span>
                  </CircularLabel>

                  <CircularLabel
                    id={makeGoToEditResumeId(id)}
                    color="blue"
                    onClick={() => goToResume(title)}
                  >
                    <Icon name="pencil" />
                  </CircularLabel>

                  <CircularLabel
                    color="green"
                    onClick={() => herunterladenLebenslauf(title)}
                  >
                    <Icon name="cloud download" />
                  </CircularLabel>

                  <CircularLabel
                    color="red"
                    onClick={() => {
                      einstellenBestatigenLoschenId(id);
                    }}
                  >
                    <Icon name="delete" />

                    <span
                      id={makeDeleteId(id)}
                      className="control-label-text"
                      ref={setConfirmDeleteTriggerRef(id)}
                    >
                      {`delete ${title}`}
                    </span>

                    {renderConfirmDelete(node)}

                    {renderDeleteError(node)}
                  </CircularLabel>
                </div>

                <div
                  id={makeResumeRowTitleContainerId(id)}
                  className={`clickable ${domRowTitleClass}`}
                  onClick={() => {
                    dispatch({
                      type: ActionType.SHOW_UPDATE_RESUME_UI_TRIGGER,
                      resume: node,
                    });
                  }}
                  onMouseEnter={() => {
                    dispatch({
                      type: ActionType.SHOW_UPDATE_RESUME_UI_TRIGGER,
                      resume: node,
                    });
                  }}
                  onMouseLeave={() => {
                    dispatch({
                      type: ActionType.DISMISS_SHOW_UPDATE_RESUME_UI_TRIGGER,
                    });
                  }}
                >
                  <span id={makeResumeRowTitleId(id)}>{title}</span>

                  {stateMachine.updateUITrigger.value === "active" &&
                    stateMachine.updateUITrigger.active.context.resume.id ===
                      id && (
                      <Button
                        type="button"
                        className={domUpdateUITriggerClassname}
                        id={makeShowUpdateResumeUITriggerBtnId(id)}
                        onClick={evt => {
                          // otherwise this button will be displayed again by
                          // parent click handler
                          evt.stopPropagation();

                          dispatch({
                            type: ActionType.SHOW_UPDATE_RESUME_UI,
                            mode: Mode.update,
                          });
                        }}
                        color="blue"
                      >
                        Edit
                      </Button>
                    )}
                </div>

                <div className="column modified-date">
                  {dateFormat(updatedAt, "Do MMM, YYYY H:mm A")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderDeleteError({ id }: ResumeTitles_listResumes_edges_node) {
    if (!(loschenFehler && loschenFehler.id === id)) {
      return null;
    }

    return (
      <Popup
        context={deleteTriggerRefs.current[id]}
        position="top center"
        offset={10}
        open={loschenFehler.id === id}
        onClose={handleDeleteErrorPopup}
      >
        <div style={{ color: "red" }}>
          {loschenFehler.errors.map((t, index) => (
            <div key={index}>{t}</div>
          ))}
        </div>
      </Popup>
    );
  }

  function renderConfirmDelete({
    id,
    title,
  }: ResumeTitles_listResumes_edges_node) {
    if (bestatigenLoschenId !== id) {
      return null;
    }

    return (
      <Popup
        id={confirmDeleteMsgId}
        context={deleteTriggerRefs.current[id]}
        position="top center"
        offset={10}
        open={bestatigenLoschenId === id}
        onClose={handleConfirmDeletePopup}
      >
        {uiTexts.confirmDeleteMsg}
        <span
          style={{
            fontWeight: "bolder",
            marginRight: "5px",
            wordBreak: "break-all",
          }}
        >
          {title}?
        </span>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5px",
          }}
        >
          <Button
            data-testid={`yes to delete ${title}`}
            id={makeYesConfirmDeleteId(id)}
            color="red"
            onClick={evt => {
              evt.stopPropagation();
              handleConfirmDeletePopup();
              loschenLebenslauf(id);
            }}
          >
            Yes
          </Button>

          <Button
            id={makeNoConfirmDeleteId(id)}
            data-testid={`${uiTexts.notToDelete} ${title}`}
            color="blue"
            content="No"
            onClick={evt => {
              evt.stopPropagation();
              handleConfirmDeletePopup();
            }}
          />
        </div>
      </Popup>
    );
  }

  function render() {
    if (loading) {
      return <Loading data-testid="loading resume titles" />;
    }

    return (
      <>
        <div className="main-content">
          {error && <div id={dataLoadingErrorId}>{error.message}</div>}

          {renderTitles()}
        </div>

        {edges && !!edges.length && (
          <div
            id={triggerCreateNewResumeId}
            className="new"
            onClick={openModalForCreate}
          >
            <span>+</span>
          </div>
        )}

        {renderModal()}
      </>
    );
  }

  return (
    <div className="components-home">
      <Header />

      <div className="main">{render()}</div>
    </div>
  );
}
