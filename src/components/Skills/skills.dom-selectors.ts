import { CreateSkillInput } from "../../graphql/apollo-types/globalTypes";

export const prefix = "components-skills";
export const fieldName = "skills";

export function makeSkillId(id: Id) {
  return `${prefix}-${id}`;
}

export function makeDescriptionInputId(id: Id) {
  return `${prefix}-description-field-${id}`;
}

export function makeAchievementId(id: Id) {
  return `{prefix}-achievement-${id}`;
}

export function makeSkillFieldName(
  index: number | string,
  key: keyof CreateSkillInput,
) {
  return `${fieldName}[${index}].${key}`;
}

type Id = string | number;
