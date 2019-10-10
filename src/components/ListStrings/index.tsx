import React, { useContext, useEffect, memo, useState } from "react";
import { TextArea, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, Field } from "formik";
import { CircularLabel } from "../CircularLabel";
import { RegularField } from "../RegularField";
import { FormContext } from "../UpdateResumeForm/update-resume.utils";
import { ListDisplayCtrlNames, makeListDisplayCtrlTestId } from "../components";

interface Props {
  values: string[];
  fieldName: string;
  arrayHelper: FieldArrayRenderProps;
  hiddenLabel?: string;
  header?: JSX.Element;
  controlComponent?: React.ComponentClass | React.FunctionComponent;
  appendToHiddenLabel?: string;
}

export const ListStrings = memo(ListStringsComp, ListStringsDiff);

export function ListStringsComp(props: Props) {
  const {
    values,
    fieldName: parentFieldName,
    arrayHelper,
    hiddenLabel,
    header,
    controlComponent,
    appendToHiddenLabel
  } = props;

  const len = values.length;

  const [swapped, setSwapped] = useState(ListDisplayCtrlNames.none);

  const { valueChanged } = useContext(FormContext);

  useEffect(() => {
    if (swapped !== ListDisplayCtrlNames.none) {
      setSwapped(ListDisplayCtrlNames.none);
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
                  {!(len === 1 || len === index1) && (
                    <CircularLabel
                      data-testid={makeListDisplayCtrlTestId(
                        fieldName,
                        ListDisplayCtrlNames.moveDown
                      )}
                      color="blue"
                      onClick={function onSwapAchievementsUp() {
                        arrayHelper.swap(index, index1);
                        setSwapped(ListDisplayCtrlNames.moveDown);
                      }}
                    >
                      <Icon name="arrow down" />
                    </CircularLabel>
                  )}

                  {len > 1 && (
                    <CircularLabel
                      data-testid={makeListDisplayCtrlTestId(
                        fieldName,
                        ListDisplayCtrlNames.remove
                      )}
                      color="red"
                      onClick={function onRemoveAchievement() {
                        arrayHelper.remove(index);
                        setSwapped(ListDisplayCtrlNames.remove);
                      }}
                    >
                      <Icon name="remove" />
                    </CircularLabel>
                  )}

                  <CircularLabel
                    data-testid={makeListDisplayCtrlTestId(
                      fieldName,
                      ListDisplayCtrlNames.add
                    )}
                    color="green"
                    onClick={function onAddAchievement() {
                      arrayHelper.insert(index1, "");
                      setSwapped(ListDisplayCtrlNames.add);
                    }}
                  >
                    <Icon name="add" />
                  </CircularLabel>

                  {index1 > 1 && (
                    <CircularLabel
                      data-testid={makeListDisplayCtrlTestId(
                        fieldName,
                        ListDisplayCtrlNames.moveUp
                      )}
                      color="blue"
                      onClick={function onSwapAchievementsUp() {
                        arrayHelper.swap(index, index - 1);
                        setSwapped(ListDisplayCtrlNames.moveUp);
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

function ListStringsDiff(
  { values: values1 }: Props,
  { values: values2 }: Props
) {
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
