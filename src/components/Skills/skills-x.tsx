import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { FastField, FieldArray } from "formik";

import { Section, ChildProps } from "../UpdateResumeForm/update-resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { CreateSkillInput } from "../../graphql/apollo/types/globalTypes";
import { emptyVal } from "./skills";
import ListIndexHeader from "../ListIndexHeader";
import ListStrings from "../ListStrings";

interface Props extends ChildProps {
  label: Section;
  values?: Array<CreateSkillInput | null> | null;
}

let cachedValues: CreateSkillInput[] = [];
const HeaderLabelText = "Skill";

export class Skills extends React.Component<Props, {}> {
  componentWillUnmount() {
    cachedValues = (null as unknown) as CreateSkillInput[];
  }

  render() {
    const { label } = this.props;

    const values = (this.props.values || [
      { ...emptyVal }
    ]) as CreateSkillInput[];

    cachedValues = values;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="skills-section"
        />

        <FieldArray
          name="skills"
          render={arrayHelper => values.map(this.renderSkill)}
        />
      </>
    );
  }

  renderSkill = (skill: CreateSkillInput, index: number) => {
    const { setFieldValue } = this.props;
    const { description } = skill;
    const fieldName = "skills";
    let achievements = skill.achievements || [""];

    if (achievements.length === 0) {
      achievements = [""];
    }

    return (
      <Card key={index}>
        <ListIndexHeader
          index={index}
          label={HeaderLabelText}
          fieldName={fieldName}
          setFieldValue={setFieldValue}
          values={cachedValues as CreateSkillInput[]}
          empty={emptyVal}
        />

        <Card.Content>
          <FastField
            name={makeName(index, "description")}
            label="Description (e.g Leadership)"
            defaultValue={description}
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

export default Skills;

function makeName(index: number, key: keyof CreateSkillInput) {
  return `skills[${index - 1}].${key}`;
}
