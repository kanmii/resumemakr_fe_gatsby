import React, { useContext } from "react";
import { Card, Icon } from "semantic-ui-react";

import "./list-index-header-styles.scss";
import { SetFieldValue } from "../utils";
import { FormContext } from "../ResumeForm/resume-form";
import { CircularLabel } from "../circular-label";

interface Props<TValues> {
  index: number;
  label: string;
  setFieldValue: SetFieldValue<TValues>;
  fieldName: string;
  values: TValues[];
  empty: TValues;
  idPrefix?: string;
}

export function ListIndexHeader<TValues extends { index: number }>(
  props: Props<TValues>
) {
  const {
    index,
    label,
    setFieldValue,
    fieldName,
    values,
    empty,
    idPrefix
  } = props;

  const { valueChanged } = useContext(FormContext);

  const id = (idPrefix || label) + "-" + index;
  const len = values.length;

  return (
    <Card.Content className="components-list-index-header">
      <Card.Header id={id}>
        {`${label ? label + " #" + index : "#" + index}`}
      </Card.Header>

      <div>
        {len > index && (
          <CircularLabel
            color="blue"
            onClick={function onSwapExperienceDown() {
              setFieldValue(fieldName, swap<TValues>(values, index, index + 1));

              setTimeout(() => {
                valueChanged();
              });
            }}
          >
            <Icon name="arrow down" />
          </CircularLabel>
        )}

        {len > 1 && (
          <CircularLabel
            color="red"
            onClick={function onRemoveItem() {
              setFieldValue(fieldName, remove<TValues>(values, index));

              setTimeout(() => {
                valueChanged();
              });
            }}
          >
            <Icon name="remove" />
          </CircularLabel>
        )}

        <CircularLabel
          color="green"
          onClick={function onAddItem() {
            setFieldValue(fieldName, add<TValues>(values, index, empty));

            setTimeout(() => {
              valueChanged();
            });
          }}
        >
          <Icon name="add" />
        </CircularLabel>

        {index > 1 && (
          <CircularLabel
            color="blue"
            onClick={function onSwapExperienceUp() {
              setFieldValue(fieldName, swap<TValues>(values, index, index - 1));

              setTimeout(() => {
                valueChanged();
              });
            }}
          >
            <Icon name="arrow up" />
          </CircularLabel>
        )}
      </div>
    </Card.Content>
  );
}

export default ListIndexHeader;

function swap<TValues extends { index: number }>(
  fields: TValues[],
  indexA: number,
  indexB: number
): TValues[] {
  return fields.map(value => {
    const index = value.index;

    if (index === indexA) {
      value.index = indexB;
    } else if (index === indexB) {
      value.index = indexA;
    }

    return value;
  });
}

function remove<TValues extends { index: number }>(
  fields: TValues[],
  index: number
): TValues[] {
  return fields.reduce(
    (acc, value, iterationIndex) => {
      const valueIndex = value.index;

      if (valueIndex < index) {
        acc[iterationIndex] = value;
      } else if (valueIndex > index) {
        value.index = iterationIndex;
        acc[iterationIndex - 1] = value;
      }

      return acc;
    },
    [] as TValues[]
  );
}

function add<TValues extends { index: number }>(
  fields: TValues[],
  index: number,
  empty: TValues
): TValues[] {
  if (fields.length === index) {
    return [...fields, { ...empty, index: index + 1 }];
  }

  return fields.reduce(
    (acc, value, iterationIndex) => {
      const expInd = value.index;

      if (expInd < index) {
        acc[iterationIndex] = value;
      } else if (expInd === index) {
        acc[iterationIndex] = value;
        acc[iterationIndex + 1] = { ...empty, index: index + 1 };
      } else if (expInd > index) {
        value.index = expInd + 1;
        acc[iterationIndex + 1] = value;
      }

      return acc;
    },
    [] as TValues[]
  );
}
