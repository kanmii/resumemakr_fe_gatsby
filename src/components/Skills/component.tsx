import React, { useContext } from "react";
import { Icon, Card } from "semantic-ui-react";
import { FastField, FieldArray } from "formik";
import { SectionLabel } from "../SectionLabel";
import { RegularField } from "../RegularField";
import { CreateSkillInput } from "../../graphql/apollo/types/globalTypes";
import { emptyVal, Props, makeSkillFieldName, uiTexts } from "./utils";
import { ListIndexHeader } from "../ListIndexHeader";
import { ListStrings } from "../ListStrings";
import { SubFieldLabel } from "../components";
import { FormContext } from "../UpdateResumeForm/update-resume.utils";

const HeaderLabelText = "Skill";

export function Skills(props: Props) {
  const { label } = props;

  const values = (props.values || [{ ...emptyVal }]) as CreateSkillInput[];

  return (
    <>
      <SectionLabel
        label={label}
        ico={<Icon name="won" />}
        data-testid="skills-section"
      />

      <FieldArray
        name="skills"
        render={arrayHelper =>
          values.map((skill, index) => (
            <Skill key={index} skill={skill} index={index} values={values} />
          ))
        }
      />
    </>
  );
}

function Skill({
  skill,
  index,
  values
}: {
  skill: CreateSkillInput;
  index: number;
  values: CreateSkillInput[];
}) {
  const { description } = skill;
  const fieldName = "skills";
  let achievements = skill.achievements || [""];

  if (achievements.length === 0) {
    achievements = [""];
  }

  const { setFieldValue } = useContext(FormContext);

  return (
    <Card key={index}>
      <ListIndexHeader
        index={index}
        label={HeaderLabelText}
        fieldName={fieldName}
        setFieldValue={setFieldValue}
        values={values}
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
}
