/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { useEffect } from "react";
import { Card, Icon } from "semantic-ui-react";
import { FastField, FieldArray } from "formik";
import { CreateExperienceInput } from "../../graphql/apollo/types/globalTypes";
import { RegularField } from "../RegularField";
import { SectionLabel } from "../SectionLabel";
import {
  emptyVal,
  Props,
  uiTexts,
  makeExperienceFieldName,
} from "./experiences.utils";
import { IterableControls } from "../IterableControls/iterable-controls.index";
import { ListStrings } from "../ListStrings/list-strings.index";
import { SubFieldLabel } from "../components";
import { prefix } from "./experiences.dom-selectors";
import { ChildProps } from "../UpdateResumeForm/update-resume.utils";

const HeaderLabelText = "Company";

export function Experiences(props: Props) {
  const { location, label, setFieldValue } = props;

  const values = (props.values || [{ ...emptyVal }]) as CreateExperienceInput[];

  useEffect(
    function scrollToExperience() {
      const hash = (location && location.hash) || "";
      const id = hash.split("/")[2];

      if (!id) {
        return;
      }

      const $id =
        document.getElementById(id) || document.getElementById("company-1");

      if (!$id) {
        return;
      }

      $id.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "start",
      });
    },
    [location],
  );

  return (
    <>
      <SectionLabel
        label={label}
        ico={<Icon name="won" />}
        data-testid="experiences-section"
        id={prefix}
      />

      <FieldArray
        name="experiences"
        render={() =>
          values.map((experience, index, iterableExperiences) => {
            return (
              <ExperienceComponent
                key={experience.id || index}
                experience={experience}
                index={index}
                setFieldValue={setFieldValue}
                iterableExperiences={
                  iterableExperiences as CreateExperienceInput[]
                }
              />
            );
          })
        }
      />
    </>
  );
}

interface ExperienceComponentProps {
  experience: CreateExperienceInput;
  index: number;
  setFieldValue: ChildProps["setFieldValue"];
  iterableExperiences: CreateExperienceInput[];
}

function ExperienceComponent(props: ExperienceComponentProps) {
  const { setFieldValue, experience, index, iterableExperiences } = props;

  let achievements = experience.achievements || [""];

  if (achievements.length === 0) {
    achievements = [""];
  }

  const fieldName = "experiences";

  return (
    <Card key={index}>
      <IterableControls
        index={index}
        label={HeaderLabelText}
        fieldName={fieldName}
        setFieldValue={setFieldValue}
        values={iterableExperiences}
        empty={emptyVal}
      />

      <Card.Content>
        <FastField
          name={makeExperienceFieldName(index, "position")}
          label={
            <SubFieldLabel
              text={uiTexts.positionLabel}
              fieldName={makeExperienceFieldName(index, "position")}
            />
          }
          defaultValue={experience.position}
          component={RegularField}
        />

        <FastField
          name={makeExperienceFieldName(index, "companyName")}
          label={
            <SubFieldLabel
              text={uiTexts.companyNameLabel}
              fieldName={makeExperienceFieldName(index, "companyName")}
            />
          }
          defaultValue={experience.companyName}
          component={RegularField}
        />

        <FastField
          name={makeExperienceFieldName(index, "fromDate")}
          label={
            <SubFieldLabel
              text={uiTexts.fromDateLabel}
              fieldName={makeExperienceFieldName(index, "fromDate")}
            />
          }
          defaultValue={experience.fromDate}
          component={RegularField}
        />

        <FastField
          name={makeExperienceFieldName(index, "toDate")}
          label={
            <SubFieldLabel
              text={uiTexts.toDateLabel}
              fieldName={makeExperienceFieldName(index, "toDate")}
            />
          }
          defaultValue={experience.toDate}
          component={RegularField}
        />

        <FieldArray
          name={makeExperienceFieldName(index, "achievements")}
          render={helper => {
            return (
              <ListStrings
                values={achievements as string[]}
                arrayHelper={helper}
                header={
                  <div>
                    {uiTexts.achievementsLabels1}
                    <span>{uiTexts.achievementsLabels2}</span>
                  </div>
                }
                fieldName={makeExperienceFieldName(index, "achievements")}
                appendToHiddenLabel={uiTexts.achievementsLabels2}
              />
            );
          }}
        />
      </Card.Content>
    </Card>
  );
}
