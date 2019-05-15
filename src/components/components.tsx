import React from "react";

export enum ListDisplayCtrlNames {
  add = "add",

  remove = "remove",

  moveUp = "move up",

  moveDown = "move down",

  none = "none"
}

export function makeListDisplayCtrlTestId(
  fieldName: string,
  ctrlName: ListDisplayCtrlNames,
  ...others: Array<number | string>
) {
  return fieldName + " " + ctrlName + (others || []).join(" ");
}

export function addClassNames(
  className1: string,
  ...otherClassNames: Array<string | undefined>
) {
  if (otherClassNames) {
    return className1 + " " + otherClassNames.join(" ");
  }

  return className1;
}

export function SubFieldLabel({
  fieldName,
  text
}: {
  fieldName: string;
  text: string;
}) {
  return (
    <>
      <label htmlFor={fieldName} className="visually-hidden">
        {fieldName}
      </label>

      <label>{text}</label>
    </>
  );
}
