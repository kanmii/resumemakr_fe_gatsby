const prefix = "list-string";

export function makeInputId(id: Id) {
  return id ? `${prefix}-input-${id}` : "";
}

export function makeMoveUpId(id: Id) {
  return `${prefix}-move-up-${id}`;
}

export function makeMoveDownId(id: Id) {
  return `${prefix}-move-down-${id}`;
}

export function makeRemoveId(id: Id) {
  return `${prefix}-remove-${id}`;
}

export function makeAddId(id: Id) {
  return `${prefix}-add-${id}`;
}

export type Id = string | number;
