export const prefix = "components-experiences";

export function makeAchievementId(id: Id) {
  return `${prefix}-achievement-${id}`;
}

type Id = string | number;
