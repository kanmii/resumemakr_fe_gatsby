import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { FastField, FieldArray, FieldArrayRenderProps } from "formik";

import { CreateExperienceInput } from "../../graphql/apollo/types/globalTypes";
import RegularField from "../RegularField";
import SectionLabel from "../SectionLabel";
import { emptyVal, Props, uiTexts } from "./experiences";
import ListIndexHeader from "../ListIndexHeader";
import ListStrings from "../ListStrings";

let cachedValues: CreateExperienceInput[] = [];
const HeaderLabelText = "Company";

export class Experiences extends React.Component<Props, {}> {
  componentDidMount() {
    this.scrollToExperience();
  }

  componentDidUpdate() {
    this.scrollToExperience();
  }

  componentWillUnmount() {
    cachedValues = (null as unknown) as CreateExperienceInput[];
  }

  render() {
    const { label } = this.props;

    const values = (this.props.values || [
      { ...emptyVal }
    ]) as CreateExperienceInput[];

    cachedValues = values;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="experiences-section"
        />

        <FieldArray
          name="experiences"
          render={helper =>
            values.map((exp, index) => {
              return this.renderExperience(exp, index, helper);
            })
          }
        />
      </>
    );
  }

  private renderExperience = (
    exp: CreateExperienceInput,
    iterationIndex: number,
    arrayHelper: FieldArrayRenderProps
  ) => {
    const { setFieldValue } = this.props;

    let achievements = exp.achievements || [""];

    if (achievements.length === 0) {
      achievements = [""];
    }

    const fieldName = "experiences";

    return (
      <Card key={iterationIndex}>
        <ListIndexHeader
          index={iterationIndex}
          label={HeaderLabelText}
          fieldName={fieldName}
          setFieldValue={setFieldValue}
          values={cachedValues as CreateExperienceInput[]}
          empty={emptyVal}
          arrayHelper={arrayHelper}
        />

        <Card.Content>
          <FastField
            name={makeExperienceFieldName(iterationIndex, "position")}
            label={
              <SubFieldLabel
                text={uiTexts.positionLabel}
                fieldName={makeExperienceFieldName(iterationIndex, "position")}
              />
            }
            defaultValue={exp.position}
            component={RegularField}
          />

          <FastField
            name={makeExperienceFieldName(iterationIndex, "companyName")}
            label={
              <SubFieldLabel
                text={uiTexts.companyNameLabel}
                fieldName={makeExperienceFieldName(
                  iterationIndex,
                  "companyName"
                )}
              />
            }
            defaultValue={exp.companyName}
            component={RegularField}
          />

          <FastField
            name={makeExperienceFieldName(iterationIndex, "fromDate")}
            label={
              <SubFieldLabel
                text={uiTexts.fromDateLabel}
                fieldName={makeExperienceFieldName(iterationIndex, "fromDate")}
              />
            }
            defaultValue={exp.fromDate}
            component={RegularField}
          />

          <FastField
            name={makeExperienceFieldName(iterationIndex, "toDate")}
            label={
              <SubFieldLabel
                text={uiTexts.toDateLabel}
                fieldName={makeExperienceFieldName(iterationIndex, "toDate")}
              />
            }
            defaultValue={exp.toDate}
            component={RegularField}
          />

          <FieldArray
            name={makeExperienceFieldName(iterationIndex, "achievements")}
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
                  fieldName={makeExperienceFieldName(
                    iterationIndex,
                    "achievements"
                  )}
                  appendToHiddenLabel={uiTexts.achievementsLabels2}
                />
              );
            }}
          />
        </Card.Content>
      </Card>
    );
  };

  private scrollToExperience = () => {
    const { location } = this.props;

    // istanbul ignore next:
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
      inline: "start"
    });
  };
}

export default Experiences;

/**
 * index is 0-based
 */
export function makeExperienceFieldName(
  index: number,
  key: keyof CreateExperienceInput
) {
  return `experiences[${index}].${key}`;
}

function SubFieldLabel({
  fieldName,
  text
}: {
  fieldName: string;
  text: string;
}) {
  return (
    <>
      <label htmlFor={fieldName} className="visually-hidden">
        {fieldName}
      </label>
      <label>{text}</label>
    </>
  );
}
