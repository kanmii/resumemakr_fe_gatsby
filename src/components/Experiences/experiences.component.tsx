import React from "react";
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
      { ...emptyVal },
    ]) as CreateExperienceInput[];

    cachedValues = values;

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
          render={() => values.map(this.renderExperience)}
        />
      </>
    );
  }

  private renderExperience = (exp: CreateExperienceInput, index: number) => {
    const { setFieldValue } = this.props;

    let achievements = exp.achievements || [""];

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
          values={cachedValues as CreateExperienceInput[]}
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
            defaultValue={exp.position}
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
            defaultValue={exp.companyName}
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
            defaultValue={exp.fromDate}
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
            defaultValue={exp.toDate}
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
  };

  private scrollToExperience = () => {
    const { location } = this.props;
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
  };
}
