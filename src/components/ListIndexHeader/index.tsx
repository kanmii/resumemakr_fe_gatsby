import React, { useContext, useState, useEffect, useRef } from "react";
import { Card, Icon } from "semantic-ui-react";
import "./styles.scss";
import { SetFieldValue } from "../utils";
import { FormContext } from "../UpdateResumeForm/update-resume.utils";
import { CircularLabel } from "../CircularLabel";
import { ListDisplayCtrlNames, makeListDisplayCtrlTestId } from "../components";

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

  const id = (idPrefix || label) + "-" + index;
  const len = values.length;

  const [swapped, setSwapped] = useState(ListDisplayCtrlNames.none);

  const prevLenRef = useRef(len);

  const { valueChanged } = useContext(FormContext);

  const index1 = index + 1;

  useEffect(() => {
    /**
     * This branch is necessary because when we delete the last item the call
     * to `setSwapped(ListDisplayCtrlNames.remove)` will not be effective in
     * this update (but becomes effective in the next update e.g. when we blur
     * a form element). However, since the delete event immediately changes the
     * value, we watch for `len` and if it has changed (the reason we
     * introduced `prevLenRef`), we then call `valueChanged()` to save to
     * server.
     */
    if (prevLenRef.current !== len) {
      prevLenRef.current = len;
      setSwapped(ListDisplayCtrlNames.none);
      valueChanged();

      /**
       * This branch works in all cases in the current update except when we
       * delete last item.
       */
    } else if (swapped !== ListDisplayCtrlNames.none) {
      setSwapped(ListDisplayCtrlNames.none);
      valueChanged();
    }
  }, [swapped, len]);

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
              setFieldValue(fieldName, swap<TValues>(values, index, index1));
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
              setSwapped(ListDisplayCtrlNames.remove);
              setFieldValue(fieldName, remove<TValues>(values, index));
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
            setFieldValue(fieldName, add<TValues>(values, index, empty));
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
              setFieldValue(fieldName, swap<TValues>(values, index, index - 1));
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

enum SwapDirection {
  down = -1, // Swap down: indexA < indexB e.g 2 to 3 (2 - 3 = -1)
  up = 1 // Swap up: indexA > indexB e.g 3 to 2 (3 - 2 = 1)
}

/**
 * Indices indexA and indexB are 0-based while value.index is 1-based
 */
function swap<TValue extends { index: number }>(
  fields: TValue[],
  indexA: number,
  indexB: number
): TValue[] {
  const swapDirection = indexA - indexB;

  return fields.reduce(
    (acc, value, iterationIndex) => {
      /**
       * For instance if we are swapping indexA=2 and indexB=3 (down). Then
       * valueA.index = 3 and
       * valueB.index = 4 (value.index is 1-based).
       * So at the end of the day,
       * valueA.index changes from 3 to 4 i.e (indexA=2 + 2) = down, and
       * valueB.index changes from 4 to 3 i.e (indexB=3) = up
       */
      const valueIndexDown = iterationIndex + 2;
      const valueIndexUp = iterationIndex;

      const swapIndexDown = iterationIndex + 1;
      const swapIndexUp = iterationIndex - 1;

      if (iterationIndex === indexA) {
        if (swapDirection === SwapDirection.down) {
          value.index = valueIndexDown;
          acc[swapIndexDown] = value;
        } else {
          value.index = valueIndexUp;
          acc[swapIndexUp] = value;
        }
      } else if (iterationIndex === indexB) {
        if (swapDirection === SwapDirection.down) {
          value.index = valueIndexUp;
          acc[swapIndexUp] = value;
        } else {
          value.index = valueIndexDown;
          acc[swapIndexDown] = value;
        }
      } else {
        value.index = iterationIndex + 1;
        acc[iterationIndex] = value;
      }

      return acc;
    },
    Array(fields.length) as TValue[]
  );
}

function remove<TValues extends { index: number }>(
  fields: TValues[],
  removeIndex: number // 0-based
): TValues[] {
  const result = fields.reduce(
    (acc, value, iterationIndex) => {
      if (iterationIndex < removeIndex) {
        acc[iterationIndex] = value;
      } else if (iterationIndex > removeIndex) {
        value.index = iterationIndex;
        acc[iterationIndex - 1] = value;
      }

      return acc;
    },
    [] as TValues[]
  );

  return result;
}

function add<TValues extends { index: number }>(
  fields: TValues[],
  index: number, // 0-based
  empty: TValues
): TValues[] {
  if (fields.length === index + 1) {
    return [...fields, { ...empty, index: index + 2 }];
  }

  return fields.reduce(
    (acc, value, iterationIndex) => {
      if (iterationIndex < index) {
        acc[iterationIndex] = value;
      } else if (iterationIndex === index) {
        acc[iterationIndex] = value;
        acc[iterationIndex + 1] = { ...empty, index: index + 2 };
      } else {
        value.index = iterationIndex + 2;
        acc[iterationIndex + 1] = value;
      }

      return acc;
    },
    [] as TValues[]
  );
}
