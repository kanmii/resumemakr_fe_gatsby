export const prefix = "components-education";

export function makeControlsId(id: Id) {
  return `${prefix}-controls-${id}`;
}

export function makeCourseInputId(id: Id) {
  return `${prefix}-course-input-${id}`;
}

export function makeAchievementId(id: Id) {
  return `${prefix}-achievement-${id}`;
}

type Id = string | number;
