import React from "react";
import { Card } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { SectionLabel } from "../SectionLabel";
import { RegularField } from "../RegularField";
import { emptyVal, RowItemsLabels, Props, makeRatedName } from "./utils";
import {
  RatedInput,
  CreateExperienceInput
} from "../../graphql/apollo/types/globalTypes";
import { ListIndexHeader } from "../ListIndexHeader";
import { SetFieldValue } from "../utils";
import { SubFieldLabel } from "../components";

export function Rated(props: Props) {
  const {
    label,
    setFieldValue,
    icon,
    fieldName,
    idPrefix,
    rowItemsLabels,
    dataTestId
  } = props;

  let values = props.values as RatedInput[];

  if (!values || !values.length) {
    values = [{ ...emptyVal }];
  }

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
              index={index}
              values={values}
            />
          ))
        }
      />
    </>
  );
}

interface ItemProps {
  value: RatedInput;
  arrayHelper: FieldArrayRenderProps;
  setFieldValue: SetFieldValue<CreateExperienceInput>;
  idPrefix: string;
  fieldName: string;
  rowItemsLabels: RowItemsLabels;
  index: number;
  values: RatedInput[];
}

function Item({
  value,
  arrayHelper,
  setFieldValue,
  idPrefix,
  fieldName,
  rowItemsLabels,
  index,
  values
}: ItemProps) {
  const { level, description } = value;

  return (
    <Card>
      <ListIndexHeader
        index={index}
        label={""}
        idPrefix={idPrefix}
        fieldName={fieldName}
        setFieldValue={setFieldValue}
        values={values}
        empty={emptyVal}
      />

      <Card.Content>
        <FastField
          name={makeRatedName(fieldName, index, "description")}
          emptyValue={description}
          component={RegularField}
          label={
            <SubFieldLabel
              text={rowItemsLabels.description}
              fieldName={makeRatedName(fieldName, index, "description")}
            />
          }
        />

        <FastField
          name={makeRatedName(fieldName, index, "level")}
          emptyValue={level}
          component={RegularField}
          label={
            <SubFieldLabel
              text={rowItemsLabels.level}
              fieldName={makeRatedName(fieldName, index, "level")}
            />
          }
        />
      </Card.Content>
    </Card>
  );
}
