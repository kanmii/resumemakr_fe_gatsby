import React, { useRef, useEffect, useState, MutableRefObject } from "react";
import { Form, Icon, Input } from "semantic-ui-react";
import lodashDebounce from "lodash/debounce";
import lodashIsEqual from "lodash/isEqual";
import update from "immutability-helper";
import { FieldArray } from "formik";
import { Cancelable } from "lodash";

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
  uiTexts,
  State
} from "./resume-form";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import PersonalInfo from "../PersonalInfo";
import Experiences from "../Experiences";
import Education from "../Education";
import Skills from "../Skills";
import Loading from "../Loading";
import { ALREADY_UPLOADED } from "../../constants";
import { UpdateResumeInput } from "../../graphql/apollo/types/globalTypes";
import { ResumePathHash } from "../../routing";
import logger from "../../logger";
import Rated from "../Rated";
import SectionLabel from "../SectionLabel";
import ListStrings from "../ListStrings";
import { NavBtn } from "../nav-btn";
import { EpicBtnIcon } from "../epic-btn-icon/epic-btn-icon-x";
import { ToolTip } from "../tool-tip";
import { UpdateResumeMutationFn } from "../../graphql/apollo/update-resume.mutation";

export function ResumeForm(props: Props) {
  const {
    loading,
    error: graphQlLoadingError,
    location: { pathname, hash },
    setFieldValue,
    debounceTime = 250,
    values
  } = props;

  const updateResume = props.updateResume as UpdateResumeMutationFn;

  const valuesTrackerRef = useRef<FormValues>({ ...values });
  const backToSectionRef = useRef(Section.personalInfo);
  const currentSectionRef = useRef(Section.personalInfo);

  const updateResumeFnDebounced = useRef<UpdateResumeFn>(
    lodashDebounce(updateResumeFn, debounceTime)
  );

  const [formContextValue] = useState<State>({
    valueChanged: () => null

    // tslint:disable-next-line: no-any
  } as any);

  useEffect(() => {
    updateResumeFnDebounced.current({
      formValues: values,
      valuesTrackerRef,
      updateResume,
      section: currentSectionRef.current
    });
  }, [values, hash]);

  useEffect(() => {
    return updateResumeFnDebounced.current.cancel;
  }, []);

  function urlFromSection(section: Section) {
    return `${pathname}${makeUrlHashSegment(ResumePathHash.edit, section)}`;
  }

  function sectionFromUrl(): Section {
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

  function renderCurrEditingSection() {
    const label = sectionLabelToHeader(currentSectionRef.current);

    if (currentSectionRef.current === Section.personalInfo) {
      return <PersonalInfo values={values.personalInfo} label={label} />;
    }

    if (currentSectionRef.current === Section.experiences) {
      return (
        <Experiences
          setFieldValue={setFieldValue}
          values={values.experiences}
          label={label}
        />
      );
    } else if (currentSectionRef.current === Section.education) {
      return (
        <Education
          label={label}
          values={values.education}
          setFieldValue={setFieldValue}
        />
      );
    } else if (currentSectionRef.current === Section.skills) {
      return (
        <Skills
          label={label}
          values={values.skills}
          setFieldValue={setFieldValue}
        />
      );
    } else if (currentSectionRef.current === Section.addSkills) {
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
    } else if (currentSectionRef.current === Section.langs) {
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
    } else if (currentSectionRef.current === Section.hobbies) {
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

  if (currentSectionRef.current !== Section.preview) {
    if (graphQlLoadingError) {
      return (
        <div data-testid="component-resume-update-loading-error">
          {JSON.stringify(graphQlLoadingError)}
        </div>
      );
    }

    if (loading) {
      return (
        <div className="component-resume-form container--loading">
          <Loading data-testid="component-resume-update-loading" />
        </div>
      );
    }
  }

  currentSectionRef.current = sectionFromUrl();
  const prevSection = toSection(currentSectionRef.current, "prev");
  const nextSection = toSection(currentSectionRef.current, "next");
  const sectionIndex = sectionsList.indexOf(currentSectionRef.current);

  return (
    <div className="component-resume-form">
      <Form>
        <FormContextProvider value={formContextValue}>
          {renderCurrEditingSection()}
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
                  href={urlFromSection(Section.preview)}
                >
                  <ToolTip>{uiTexts.partialPreviewResumeTooltipText}</ToolTip>

                  <EpicBtnIcon className="preview-btn-icon" />

                  <span>Preview</span>
                </NavBtn>
              )}

              {sectionIndex > 0 && (
                <NavBtn className="edit-btn" href={urlFromSection(prevSection)}>
                  <ToolTip>{prevTooltipText(prevSection)}</ToolTip>

                  <EpicBtnIcon className="prev-btn-icon" />

                  <span>Previous</span>
                </NavBtn>
              )}

              {nextSection !== Section.preview && (
                <NavBtn className="next-btn" href={urlFromSection(nextSection)}>
                  <ToolTip>{nextTooltipText(nextSection)}</ToolTip>

                  <span>Next</span>

                  <EpicBtnIcon className="next-btn-icon" />
                </NavBtn>
              )}

              {nextSection === Section.preview && (
                <NavBtn
                  className="next-btn"
                  href={urlFromSection(Section.preview)}
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
              href={urlFromSection(backToSectionRef.current)}
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

export default ResumeForm;

interface UpdateResumeFnArgs {
  formValues: Partial<UpdateResumeInput>;
  valuesTrackerRef: MutableRefObject<Partial<UpdateResumeInput>>;
  updateResume: UpdateResumeMutationFn;
  section: Section;
}

type UpdateResumeFn = ((args: UpdateResumeFnArgs) => Promise<void>) &
  Cancelable;

async function updateResumeFn({
  formValues,
  valuesTrackerRef,
  updateResume,
  section
}: UpdateResumeFnArgs) {
  // tslint:disable-next-line:no-console
  console.log(
    "\n\t\tLogging start\n\n\n\n update fn formValues\n",
    formValues,
    "\n\n\n\n\t\tLogging ends\n"
  );

  if (section === Section.preview) {
    return;
  }

  const photo = formValues.personalInfo && formValues.personalInfo.photo;

  /**
   * If we are not uploading a fresh photo file, tell the server so.
   * We know we are uploading a fresh photo when the photo field is a base64
   * encoded string.
   */
  if (photo && !photo.startsWith("data:")) {
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

    const resume =
      result &&
      result.data &&
      result.data.updateResume &&
      result.data.updateResume.resume;

    if (!resume) {
      return;
    }

    valuesTrackerRef.current = getInitialValues(resume);
  } catch (error) {
    logger("error", "update catch error", error);
  }
}

export function makeUrlHashSegment(hash: ResumePathHash, section: Section) {
  return `${hash}/${section}`;
}
