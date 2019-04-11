import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { FastField, FieldArray } from "formik";

import { EducationInput } from "../../graphql/apollo/types/globalTypes";

import { Section } from "../UpdateResumeForm/update-resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { emptyVal } from "./education";
import { ChildProps } from "../UpdateResumeForm/update-resume-form";
import ListIndexHeader from "../ListIndexHeader";
import ListStrings from "../ListStrings";

let cachedValues: EducationInput[] = [];
const headerLabelText = "School";
const eduFieldName = "education";

interface Props extends ChildProps {
  label: Section;
  values?: Array<EducationInput | null> | null;
}

export class Education extends React.Component<Props, {}> {
  componentWillUnmount() {
    cachedValues = (null as unknown) as EducationInput[];
  }

  render() {
    const { label } = this.props;
    const values = (this.props.values || [{ ...emptyVal }]) as EducationInput[];
    cachedValues = values;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="education-section"
        />

        <FieldArray
          name={eduFieldName}
          render={arrayHelper => values.map(this.renderSchool)}
        />
      </>
    );
  }

  private renderSchool = (edu: EducationInput, index: number) => {
    const { setFieldValue } = this.props;
    let achievements = edu.achievements || [""];

    if (achievements.length === 0) {
      achievements = [""];
    }

    return (
      <Card key={index}>
        <ListIndexHeader
          index={index}
          label={headerLabelText}
          fieldName={eduFieldName}
          setFieldValue={setFieldValue}
          values={cachedValues as EducationInput[]}
          empty={emptyVal}
        />

        <Card.Content>
          <FastField
            name={makeName(index, "school")}
            label="School name, location"
            defaultValue={edu.school}
            component={RegularField}
          />

          <FastField
            name={makeName(index, "course")}
            label="Major, minor, degree"
            defaultValue={edu.course}
            component={RegularField}
          />

          <FastField
            name={makeName(index, "fromDate")}
            label="Date from"
            defaultValue={edu.fromDate}
            component={RegularField}
          />

          <FastField
            name={makeName(index, "toDate")}
            label="Date to"
            defaultValue={edu.toDate}
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
}

export default Education;

function makeName(index: number, key: keyof EducationInput) {
  return `${eduFieldName}[${index - 1}].${key}`;
}
