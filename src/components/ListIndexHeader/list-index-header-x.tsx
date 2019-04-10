import React, { useContext, useState, useEffect } from "react";
import { Card, Icon } from "semantic-ui-react";

import "./list-index-header-styles.scss";
import { SetFieldValue } from "../utils";
import { FormContext } from "../ResumeForm/resume-form";
import { CircularLabel } from "../circular-label";
import { ListDisplayCtrlNames, makeListDisplayCtrlTestId } from "../components";
import { FieldArrayRenderProps } from "formik";

interface Props<TValues> {
  index: number;
  label: string;
  setFieldValue: SetFieldValue<TValues>;
  fieldName: string;
  values: TValues[];
  empty: TValues;
  idPrefix?: string;
  arrayHelper: FieldArrayRenderProps;
}

export function ListIndexHeader<TValues extends { index: number }>(
  props: Props<TValues>
) {
  const {
    index,
    label,
    fieldName,
    values,
    empty,
    idPrefix,
    arrayHelper
  } = props;

  const [swapped, setSwapped] = useState(ListDisplayCtrlNames.none);

  const { valueChanged } = useContext(FormContext);

  const id = (idPrefix || label) + "-" + index;
  const len = values.length;
  const index1 = index + 1;

  useEffect(() => {
    if (swapped !== ListDisplayCtrlNames.none) {
      setSwapped(ListDisplayCtrlNames.none);
      valueChanged();
    }
  }, [swapped]);

  return (
    <Card.Content className="components-list-index-header">
      <Card.Header id={id}>
        {label ? label + " #" + index1 : "#" + index1}
      </Card.Header>

      <div>
        {!(len === 1 || len === index1) && (
          <CircularLabel
            color="blue"
            onClick={function onSwapExperienceDown() {
              arrayHelper.swap(index, index1);
              setSwapped(ListDisplayCtrlNames.moveDown);
            }}
            data-testid={makeListDisplayCtrlTestId(
              fieldName,
              ListDisplayCtrlNames.moveDown,
              index
            )}
          >
            <Icon name="arrow down" />
          </CircularLabel>
        )}

        {len > 1 && (
          <CircularLabel
            color="red"
            onClick={function onRemoveItem() {
              arrayHelper.remove(index);
              setSwapped(ListDisplayCtrlNames.remove);
            }}
            data-testid={makeListDisplayCtrlTestId(
              fieldName,
              ListDisplayCtrlNames.remove,
              index
            )}
          >
            <Icon name="remove" />
          </CircularLabel>
        )}

        <CircularLabel
          color="green"
          onClick={function onAddItem() {
            arrayHelper.insert(index1, empty);
            setSwapped(ListDisplayCtrlNames.add);
          }}
          data-testid={makeListDisplayCtrlTestId(
            fieldName,
            ListDisplayCtrlNames.add,
            index
          )}
        >
          <Icon name="add" />
        </CircularLabel>

        {index1 > 1 && (
          <CircularLabel
            color="blue"
            onClick={function onSwapExperienceUp() {
              arrayHelper.swap(index, index - 1);
              setSwapped(ListDisplayCtrlNames.moveUp);
            }}
            data-testid={makeListDisplayCtrlTestId(
              fieldName,
              ListDisplayCtrlNames.moveUp,
              index
            )}
          >
            <Icon name="arrow up" />
          </CircularLabel>
        )}
      </div>
    </Card.Content>
  );
}

export default ListIndexHeader;
