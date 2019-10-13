const prefix = "components-iterable-controls";

export function makeMoveDownId(id: Id) {
  return `${id}-${prefix}-move-down`;
}

export function makeAddId(id: Id) {
  return `${id}-${prefix}-add`;
}

export function makeRemoveId(id: Id) {
  return `${id}-${prefix}-remove`;
}

export function makeMoveUpId(id: Id) {
  return `${id}-${prefix}-move-up`;
}

type Id = string | number;
