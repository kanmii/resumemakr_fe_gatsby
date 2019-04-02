import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { FastField, FieldArray } from "formik";

import { CreateExperienceInput } from "../../graphql/apollo/types/globalTypes";
import RegularField from "../RegularField";
import SectionLabel from "../SectionLabel";
import { emptyVal, Props } from "./experiences";
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
          render={arrayHelper => values.map(this.renderExperience)}
        />
      </>
    );
  }

  private renderExperience = (exp: CreateExperienceInput) => {
    const { setFieldValue } = this.props;
    /**
     * index is 1-based
     */
    const { index } = exp;

    let achievements = exp.achievements || [""];

    if (achievements.length === 0) {
      achievements = [""];
    }

    const fieldName = "experiences";

    return (
      <Card key={index}>
        <ListIndexHeader
          index={index}
          label={HeaderLabelText}
          fieldName={fieldName}
          setFieldValue={setFieldValue}
          values={cachedValues as CreateExperienceInput[]}
          empty={emptyVal}
        />

        <Card.Content>
          <FastField
            name={makeName(index, "position")}
            label="Title/Position/Responsibility"
            defaultValue={exp.position}
            component={RegularField}
          />

          <FastField
            name={makeName(index, "companyName")}
            label="Company, department etc."
            defaultValue={exp.companyName}
            component={RegularField}
          />

          <FastField
            name={makeName(index, "fromDate")}
            label="Date from"
            defaultValue={exp.fromDate}
            component={RegularField}
          />

          <FastField
            name={makeName(index, "toDate")}
            label="Date to (optional)"
            defaultValue={exp.toDate}
            component={RegularField}
          />

          <FieldArray
            name={makeName(index, "achievements")}
            render={helper => {
              return (
                <ListStrings
                  values={achievements as string[]}
                  arrayHelper={helper}
                  header={
                    <div>
                      Achievements
                      <span> (responsibilities, activities)</span>
                    </div>
                  }
                  fieldName={makeName(index, "achievements")}
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
 * index is 1-based
 */
function makeName(index: number, key: keyof CreateExperienceInput) {
  return `experiences[${index - 1}].${key}`;
}
