const prefix = "list-string";

export function makeInputId(id: Id) {
  return id ? `${prefix}-input-${id}` : "";
}

export type Id = string | number;
