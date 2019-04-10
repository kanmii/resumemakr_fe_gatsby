import React from "react";
import { Card } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { Section, ChildProps } from "../UpdateResumeForm/update-resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { emptyVal } from "../Rated/rated";
import {
  RatedInput,
  CreateExperienceInput
} from "../../graphql/apollo/types/globalTypes";
import ListIndexHeader from "../ListIndexHeader";
import { SetFieldValue } from "../utils";

let cachedValues: RatedInput[] = [];

interface RowItemsLabels {
  description: string;
  level: string;
}

interface Props extends ChildProps {
  label: Section;
  values?: Array<RatedInput | null> | null;
  icon: JSX.Element;
  fieldName: string;
  idPrefix: string;
  rowItemsLabels: RowItemsLabels;
  dataTestId: string;
}

export class Rated extends React.Component<Props, {}> {
  render() {
    const {
      label,
      setFieldValue,
      icon,
      fieldName,
      idPrefix,
      rowItemsLabels,
      dataTestId
    } = this.props;

    let values = this.props.values as RatedInput[];

    if (!values || !values.length) {
      values = [{ ...emptyVal }];
    }

    cachedValues = values;

    return (
      <>
        <SectionLabel label={label} ico={icon} data-testid={dataTestId} />

        <FieldArray
          name={fieldName}
          render={arrayHelper =>
            values.map((value, index) => (
              <Item
                key={index}
                value={value}
                arrayHelper={arrayHelper}
                setFieldValue={setFieldValue}
                idPrefix={idPrefix}
                fieldName={fieldName}
                rowItemsLabels={rowItemsLabels}
              />
            ))
          }
        />
      </>
    );
  }
}

export default Rated;

interface ItemProps {
  value: RatedInput;
  arrayHelper: FieldArrayRenderProps;
  setFieldValue: SetFieldValue<CreateExperienceInput>;
  idPrefix: string;
  fieldName: string;
  rowItemsLabels: RowItemsLabels;
}

function Item({
  value,
  arrayHelper,
  setFieldValue,
  idPrefix,
  fieldName,
  rowItemsLabels
}: ItemProps) {
  const { index, level, description } = value;

  return (
    <Card>
      <ListIndexHeader
        index={index}
        label={""}
        idPrefix={idPrefix}
        fieldName={fieldName}
        setFieldValue={setFieldValue}
        values={cachedValues as RatedInput[]}
        empty={emptyVal}
      />

      <Card.Content>
        <FastField
          name={makeName(fieldName, index, "description")}
          label={rowItemsLabels.description}
          emptyValue={description}
          component={RegularField}
        />

        <FastField
          name={makeName(fieldName, index, "level")}
          label={rowItemsLabels.level}
          emptyValue={level}
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(fieldName: string, index: number, key: keyof RatedInput) {
  return `${fieldName}[${index - 1}].${key}`;
}
