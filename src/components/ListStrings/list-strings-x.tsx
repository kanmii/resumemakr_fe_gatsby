import React, { useContext } from "react";
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

export function ListStrings(props: Props) {
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

  const { valueChanged, formValues } = useContext(FormContext);

  // tslint:disable-next-line:no-console
  console.log(
    "\n\t\tLogging start\n\n\n\n ListStrings formValues\n",
    formValues,
    "\n\n\n\n\t\tLogging ends\n"
  );

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
                        valueChanged(formValues);
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
                        valueChanged(formValues);
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
                      valueChanged(formValues);
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
                        valueChanged(formValues);
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

export default ListStrings;

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

  moveDown = "move down"
}
