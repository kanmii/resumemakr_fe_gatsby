import React, { useContext } from "react";
import { Icon, Card } from "semantic-ui-react";
import { FastField, FieldArray } from "formik";
import { SectionLabel } from "../SectionLabel";
import { RegularField } from "../RegularField";
import { CreateSkillInput } from "../../graphql/apollo-types/globalTypes";
import { emptyVal, Props, uiTexts } from "./skills.utils";
import { IterableControls } from "../IterableControls/iterable-controls.index";
import { ListStrings } from "../ListStrings/list-strings.component";
import { SubFieldLabel } from "../components";
import { FormContext } from "../UpdateResumeForm/update-resume.utils";
import {
  prefix,
  makeSkillId,
  makeDescriptionInputId,
  makeAchievementId,
  makeSkillFieldName,
} from "./skills.dom-selectors";

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
        id={prefix}
      />

      <FieldArray
        name="skills"
        render={() =>
          values.map((skill, index) => (
            <Skill
              key={skill.id || index}
              skill={skill}
              index={index}
              values={values}
            />
          ))
        }
      />
    </>
  );
}

function Skill({
  skill,
  index,
  values,
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
  const domId = skill.id || index;
  const descriptionId = makeDescriptionInputId(domId);
  const descriptionName = makeSkillFieldName(domId, "description");
  const achievementsName = makeSkillFieldName(domId, "achievements");

  return (
    <Card>
      <IterableControls
        id={makeSkillId(domId)}
        index={index}
        label={HeaderLabelText}
        fieldName={fieldName}
        setFieldValue={setFieldValue}
        values={values}
        empty={emptyVal}
      />

      <Card.Content>
        <FastField
          id={descriptionId}
          name={descriptionName}
          defaultValue={description}
          component={RegularField}
          label={
            <SubFieldLabel
              text={uiTexts.descriptionLabel}
              fieldName={descriptionName}
              id={makeDescriptionInputId(domId)}
            />
          }
        />

        <FieldArray
          name={achievementsName}
          render={helper => {
            return (
              <ListStrings
                idFn={makeAchievementId}
                values={achievements as string[]}
                arrayHelper={helper}
                header={
                  <div>
                    {uiTexts.achievementsHeader1}
                    <span> {uiTexts.achievementsHeader2}</span>
                  </div>
                }
                fieldName={achievementsName}
                appendToHiddenLabel={uiTexts.achievementsHiddenLabel}
              />
            );
          }}
        />
      </Card.Content>
    </Card>
  );
}
