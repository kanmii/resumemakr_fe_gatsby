import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { FastField, FieldArray } from "formik";

import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { CreateSkillInput } from "../../graphql/apollo/types/globalTypes";
import { emptyVal, Props, makeSkillFieldName, uiTexts } from "./skills";
import ListIndexHeader from "../ListIndexHeader";
import ListStrings from "../ListStrings";
import { SubFieldLabel } from "../components";

let cachedValues: CreateSkillInput[] = [];
const HeaderLabelText = "Skill";

// export function Skills1(props: Props) {}

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
            name={makeSkillFieldName(index, "description")}
            defaultValue={description}
            component={RegularField}
            label={
              <SubFieldLabel
                text={uiTexts.descriptionLabel}
                fieldName={makeSkillFieldName(index, "description")}
              />
            }
          />

          <FieldArray
            name={makeSkillFieldName(index, "achievements")}
            render={helper => {
              return (
                <ListStrings
                  values={achievements as string[]}
                  arrayHelper={helper}
                  header={
                    <div>
                      {uiTexts.achievementsHeader1}
                      <span> {uiTexts.achievementsHeader2}</span>
                    </div>
                  }
                  fieldName={makeSkillFieldName(index, "achievements")}
                  appendToHiddenLabel={uiTexts.achievementsHiddenLabel}
                />
              );
            }}
          />
        </Card.Content>
      </Card>
    );
  };
}
