import React, {
  useRef,
  useEffect,
  MutableRefObject,
  useReducer,
  Reducer
} from "react";
import { Form, Icon, Input } from "semantic-ui-react";
import lodashDebounce from "lodash/debounce";
import lodashIsEqual from "lodash/isEqual";
import update from "immutability-helper";
import { FieldArray } from "formik";
import { Cancelable } from "lodash";
import { ApolloError } from "apollo-client";

import "./styles.scss";
import {
  FormValues,
  Section,
  toSection,
  sectionsList,
  Props,
  getInitialValues,
  FormContextProvider,
  sectionLabelToHeader,
  nextTooltipText,
  prevTooltipText,
  uiTexts
} from "./update-resume-form";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import PersonalInfo from "../PersonalInfo";
import Experiences from "../Experiences";
import Education from "../Education";
import Skills from "../Skills";
import Loading from "../Loading";
import { ALREADY_UPLOADED } from "../../constants";
import {
  UpdateResumeInput,
  CreateExperienceInput
} from "../../graphql/apollo/types/globalTypes";
import { ResumePathHash } from "../../routing";
import Rated from "../Rated";
import SectionLabel from "../SectionLabel";
import ListStrings from "../ListStrings";
import { NavBtn } from "../nav-btn";
import { EpicBtnIcon } from "../epic-btn-icon/epic-btn-icon-x";
import { ToolTip } from "../tool-tip";
import { UpdateResumeMutationFn } from "../../graphql/apollo/update-resume.mutation";
import { SetFieldValue } from "../utils";

const reducer: Reducer<State, State> = (prevState, state = {}) => {
  return { ...prevState, ...state };
};

export function UpdateResumeForm(props: Props) {
  const {
    loading,
    error: graphQlLoadingError,
    location: { pathname, hash },
    setFieldValue,
    debounceTime: propDebounceTime,
    values,
    match
  } = props;

  // istanbul ignore next: trust @reach/router to properly inject match
  const resumeTitle = match && match.title;

  // istanbul ignore next
  const debounceTime = propDebounceTime || 250;

  const updateResume = props.updateResume as UpdateResumeMutationFn;

  const [state, dispatch] = useReducer(reducer, {});

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const valuesTrackerRef = useRef<FormValues>({ ...values });
  const backToSectionRef = useRef(Section.personalInfo);
  const currentSectionRef = useRef(Section.personalInfo);

  const updateResumeFnDebounced = useRef<UpdateResumeFn>(
    lodashDebounce(updateResumeFn, debounceTime)
  );

  useEffect(() => {
    return updateResumeFnDebounced.current.cancel;
  }, []);

  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => {
        dispatch({
          loadingTooLong: true
        });
      }, 10000);
    } else {
      dispatch({
        loadingTooLong: false
      });

      // istanbul ignore next: can not figure out a way to test
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [loading]);

  if (currentSectionRef.current !== Section.preview) {
    if (graphQlLoadingError) {
      return (
        <div data-testid="component-resume-update-loading-error">
          <GqlError errors={graphQlLoadingError} />
        </div>
      );
    } else if (loading && !state.loadingTooLong) {
      return (
        <div className="component-resume-form container--loading">
          <Loading data-testid="component-resume-update-loading">
            <div>{resumeTitle}</div>

            {uiTexts.loadingText}
          </Loading>
        </div>
      );
    } else if (state.loadingTooLong) {
      return (
        <div className="component-resume-form container--loading">
          <div className="loading-too-long">
            {uiTexts.takingTooLongPrefix} <b>"{resumeTitle}"</b>
            {uiTexts.takingTooLongSuffix}
          </div>
        </div>
      );
    }
  }

  currentSectionRef.current = sectionFromUrl({
    currentSectionRef,
    backToSectionRef,
    hash
  });
  const prevSection = toSection(currentSectionRef.current, "prev");
  const nextSection = toSection(currentSectionRef.current, "next");
  const sectionIndex = sectionsList.indexOf(currentSectionRef.current);

  return (
    <div className="component-resume-form">
      <GqlError errors={state.gqlError} />

      <Form>
        <FormContextProvider
          value={{
            prevFormValues: valuesTrackerRef.current,

            valueChanged: () => {
              updateResumeFnDebounced.current({
                formValues: values,
                valuesTrackerRef,
                updateResume,
                dispatch
              });
            }
          }}
        >
          <CurrEditingSection
            section={currentSectionRef.current}
            values={values}
            setFieldValue={setFieldValue}
          />
        </FormContextProvider>

        {currentSectionRef.current === Section.preview && (
          <Preview mode={PreviewMode.preview} getResume={values} />
        )}

        <div className="bottom-navs">
          {currentSectionRef.current !== Section.preview ? (
            <>
              {nextSection !== Section.preview && (
                <NavBtn
                  className="preview-btn"
                  href={urlFromSection(Section.preview, pathname)}
                >
                  <ToolTip>{uiTexts.partialPreviewResumeTooltipText}</ToolTip>

                  <EpicBtnIcon className="preview-btn-icon" />

                  <span>Preview</span>
                </NavBtn>
              )}

              {sectionIndex > 0 && (
                <NavBtn
                  className="edit-btn"
                  href={urlFromSection(prevSection, pathname)}
                >
                  <ToolTip>{prevTooltipText(prevSection)}</ToolTip>

                  <EpicBtnIcon className="prev-btn-icon" />

                  <span>Previous</span>
                </NavBtn>
              )}

              {nextSection !== Section.preview && (
                <NavBtn
                  className="next-btn"
                  href={urlFromSection(nextSection, pathname)}
                >
                  <ToolTip>{nextTooltipText(nextSection)}</ToolTip>

                  <span>Next</span>

                  <EpicBtnIcon className="next-btn-icon" />
                </NavBtn>
              )}

              {nextSection === Section.preview && (
                <NavBtn
                  className="next-btn"
                  href={urlFromSection(Section.preview, pathname)}
                >
                  <ToolTip>End: preview your resume</ToolTip>

                  <span>Preview Your resume</span>

                  <EpicBtnIcon className="preview-btn-icon" />
                </NavBtn>
              )}
            </>
          ) : (
            <NavBtn
              className="edit-btn"
              href={urlFromSection(backToSectionRef.current, pathname)}
            >
              <ToolTip>Show resume editor</ToolTip>

              <EpicBtnIcon className="prev-btn-icon" />

              <span>{uiTexts.backToEditorBtnText}</span>
            </NavBtn>
          )}
        </div>
      </Form>
    </div>
  );
}

export default UpdateResumeForm;

interface UpdateResumeFnArgs {
  formValues: Partial<UpdateResumeInput>;
  valuesTrackerRef: MutableRefObject<Partial<UpdateResumeInput>>;
  updateResume: UpdateResumeMutationFn;
  dispatch: React.Dispatch<State>;
}

type UpdateResumeFn = ((args: UpdateResumeFnArgs) => Promise<void>) &
  Cancelable;

async function updateResumeFn({
  formValues,
  valuesTrackerRef,
  updateResume,
  dispatch
}: UpdateResumeFnArgs) {
  const photo = formValues.personalInfo && formValues.personalInfo.photo;

  /**
   * If we are not uploading a fresh photo file, tell the server so.
   * We know we are uploading a fresh photo when the photo field is a base64
   * encoded string.
   */

  if (photo && !isBase64String(photo)) {
    formValues = update(formValues, {
      personalInfo: {
        photo: {
          $set: ALREADY_UPLOADED
        }
      }
    });

    if (valuesTrackerRef.current && valuesTrackerRef.current.personalInfo) {
      valuesTrackerRef.current = update(valuesTrackerRef.current, {
        personalInfo: {
          photo: {
            $set: ALREADY_UPLOADED
          }
        }
      });
    }
  }

  // istanbul ignore next: unable to simulate in test
  if (lodashIsEqual(formValues, valuesTrackerRef.current)) {
    return;
  }

  try {
    const result = await updateResume({
      variables: {
        input: {
          ...(formValues as UpdateResumeInput)
        }
      }
    });

    // istanbul ignore next: just satisfying typescript
    const resume =
      result &&
      result.data &&
      result.data.updateResume &&
      result.data.updateResume.resume;

    if (!resume) {
      return;
    }

    /**
     * Formik will call getInitialValues(resume) when react updates props.
     * So here, we are essentially setting
     * valuesTrackerRef.current = {...formValues}.
     *
     * Ideally, this sort of thing is done in componentDidUpdate, but in this
     * case, we only want to set these values to be the same when we return
     * successfully from server. All other updates should make the values
     * different.
     */
    valuesTrackerRef.current = getInitialValues(resume);
  } catch (error) {
    dispatch({
      gqlError: error
    });
  }
}

export function makeUrlHashSegment(hash: ResumePathHash, section: Section) {
  return `${hash}/${section}`;
}

export function isBase64String(input: string) {
  if (!input.startsWith("data:image/")) {
    return false;
  }

  const [, b] = input.split(";");

  if (!b || !b.startsWith("base64,")) {
    return false;
  }

  return true;
}

interface State {
  readonly gqlError?: ApolloError | null;

  readonly loadingTooLong?: boolean;
}

function urlFromSection(section: Section, pathname: string) {
  return `${pathname}${makeUrlHashSegment(ResumePathHash.edit, section)}`;
}

function sectionFromUrl({
  currentSectionRef,
  backToSectionRef,
  hash
}: {
  currentSectionRef: React.MutableRefObject<Section>;
  backToSectionRef: React.MutableRefObject<Section>;
  hash: string;
}): Section {
  const section = hash.split("/")[1];

  const currentSection = (section
    ? section
    : Section.personalInfo
  ).toLowerCase() as Section;

  currentSectionRef.current = currentSection;

  backToSectionRef.current =
    currentSection !== Section.preview
      ? currentSection
      : backToSectionRef.current;

  return currentSection;
}

function GqlError({ errors }: { errors: ApolloError | null | undefined }) {
  if (!errors) {
    return null;
  }

  const { graphQLErrors, networkError } = errors;

  let error;

  if (networkError) {
    error = networkError.message;
  } else {
    error = graphQLErrors.map(({ message }, index) => {
      return <div key={"gql-error-" + index}>{message}</div>;
    });
  }

  return (
    <div data-testid="gql-errors" className="gql-errors">
      <div
        style={{
          fontWeight: "normal",
          fontSize: "1rem"
        }}
      >
        Error updating data!
      </div>
      {error}
    </div>
  );
}

function CurrEditingSection({
  section,
  values,
  setFieldValue
}: {
  section: Section;
  values: Partial<UpdateResumeInput>;
  setFieldValue: SetFieldValue<CreateExperienceInput>;
}) {
  const label = sectionLabelToHeader(section);

  if (section === Section.personalInfo) {
    return <PersonalInfo values={values.personalInfo} label={label} />;
  }

  if (section === Section.experiences) {
    return (
      <Experiences
        setFieldValue={setFieldValue}
        values={values.experiences}
        label={label}
      />
    );
  } else if (section === Section.education) {
    return (
      <Education
        label={label}
        values={values.education}
        setFieldValue={setFieldValue}
      />
    );
  } else if (section === Section.skills) {
    return (
      <Skills
        label={label}
        values={values.skills}
        setFieldValue={setFieldValue}
      />
    );
  } else if (section === Section.addSkills) {
    return (
      <Rated
        key={label}
        label={label}
        values={values.additionalSkills}
        setFieldValue={setFieldValue}
        rowItemsLabels={{
          description: "Skill (e.g. Editing skills)",
          level: "Rating description (e.g. Advanced) (optional)"
        }}
        fieldName="additionalSkills"
        icon={<Icon name="won" />}
        dataTestId="additional-skills-section"
        idPrefix="Add. Skill"
      />
    );
  } else if (section === Section.langs) {
    return (
      <Rated
        key={label}
        label={label}
        values={values.languages}
        rowItemsLabels={{
          description: "Language (e.g. Spanish - Certified)",
          level: "Rating description (e.g. Proficient) (optional)"
        }}
        fieldName="languages"
        icon={<Icon name="won" />}
        dataTestId="languages-section"
        setFieldValue={setFieldValue}
        idPrefix="languages"
      />
    );
  } else if (section === Section.hobbies) {
    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="hobbies-section"
        />

        <FieldArray
          name="hobbies"
          render={arrayHelper => (
            <ListStrings
              arrayHelper={arrayHelper}
              fieldName="hobbies"
              // istanbul ignore next
              values={(values.hobbies || []) as string[]}
              controlComponent={Input}
            />
          )}
        />
      </>
    );
  }

  return null;
}
