import React, { useContext, useEffect, memo, useState } from "react";
import { TextArea, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, Field } from "formik";

import { CircularLabel } from "../../styles/mixins";
import RegularField from "../RegularField";
import { FormContext } from "../ResumeForm/resume-form";

interface Props {
  values: string[];
  fieldName: string;
  arrayHelper: FieldArrayRenderProps;
  hiddenLabel?: string;
  header?: JSX.Element;
  controlComponent?: React.ComponentClass | React.FunctionComponent;
  appendToHiddenLabel?: string;
}

export const ListStrings = memo(ListStrings0, arePropsEqual);

export default ListStrings;

export function ListStrings0(props: Props) {
  const {
    values,
    fieldName: parentFieldName,
    arrayHelper,
    hiddenLabel,
    header,
    controlComponent,
    appendToHiddenLabel
  } = props;

  const valuesLen = values.length;

  const [swapped, setSwapped] = useState(ListStringsCtrlNames.none);

  const { valueChanged } = useContext(FormContext);

  useEffect(() => {
    if (swapped !== ListStringsCtrlNames.none) {
      setSwapped(ListStringsCtrlNames.none);
      valueChanged();
    }
  }, [swapped]);

  return (
    <div>
      {header || null}

      {values.map((value, index) => {
        const fieldName = makeListStringFieldName(parentFieldName, index);
        const index1 = index + 1;

        return (
          <Field
            key={index}
            name={fieldName}
            label={
              <div className="with-controls list-string-header">
                {`# ${index1}`}

                <div>
                  {valuesLen > 1 && (
                    <CircularLabel
                      data-testid={makeListStringCtrlTestId(
                        fieldName,
                        ListStringsCtrlNames.moveDown
                      )}
                      color="blue"
                      onClick={function onSwapAchievementsUp() {
                        arrayHelper.swap(index, index1);
                        setSwapped(ListStringsCtrlNames.moveDown);
                      }}
                    >
                      <Icon name="arrow down" />
                    </CircularLabel>
                  )}

                  {valuesLen > 1 && (
                    <CircularLabel
                      data-testid={makeListStringCtrlTestId(
                        fieldName,
                        ListStringsCtrlNames.remove
                      )}
                      color="red"
                      onClick={function onRemoveAchievement() {
                        arrayHelper.remove(index);
                        setSwapped(ListStringsCtrlNames.remove);
                      }}
                    >
                      <Icon name="remove" />
                    </CircularLabel>
                  )}

                  <CircularLabel
                    data-testid={makeListStringCtrlTestId(
                      fieldName,
                      ListStringsCtrlNames.add
                    )}
                    color="green"
                    onClick={function onAddAchievement() {
                      arrayHelper.insert(index1, "");
                      setSwapped(ListStringsCtrlNames.add);
                    }}
                  >
                    <Icon name="add" />
                  </CircularLabel>

                  {index1 > 1 && (
                    <CircularLabel
                      data-testid={makeListStringCtrlTestId(
                        fieldName,
                        ListStringsCtrlNames.moveUp
                      )}
                      color="blue"
                      onClick={function onSwapAchievementsUp() {
                        arrayHelper.swap(index, index - 1);
                        setSwapped(ListStringsCtrlNames.moveUp);
                      }}
                    >
                      <Icon name="arrow up" />
                    </CircularLabel>
                  )}
                </div>

                {appendToHiddenLabel && (
                  <label className="visually-hidden" htmlFor={fieldName}>
                    {makeListStringHiddenLabelText(
                      fieldName,
                      appendToHiddenLabel
                    )}
                  </label>
                )}

                {hiddenLabel && (
                  <label className="visually-hidden" htmlFor={fieldName}>
                    {hiddenLabel}
                  </label>
                )}
              </div>
            }
            defaultValue={value}
            comp={controlComponent || TextArea}
            component={RegularField}
          />
        );
      })}
    </div>
  );
}

function arePropsEqual({ values: values1 }: Props, { values: values2 }: Props) {
  const len1 = values1.length;
  const len2 = values2.length;

  if (len1 !== len2) {
    return false;
  }

  for (let i = 0; i < len1; i++) {
    if (values1[i].trim() !== values2[i].trim()) {
      return false;
    }
  }

  return true;
}

export function makeListStringFieldName(
  parentFieldName: string,
  index: number
) {
  return `${parentFieldName}[${index}]`;
}

export function makeListStringHiddenLabelText(
  fieldName: string,
  suffix: string
) {
  return fieldName + suffix;
}

export function makeListStringCtrlTestId(
  fieldName: string,
  ctrlName: ListStringsCtrlNames
) {
  return fieldName + " " + ctrlName;
}

export enum ListStringsCtrlNames {
  add = "add",

  remove = "remove",

  moveUp = "move up",

  moveDown = "move down",

  none = "none"
}
