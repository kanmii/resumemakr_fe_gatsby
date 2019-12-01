const prefix = "my-resumes";
export const triggerCreateNewResumeId = `${prefix}-new-resume`;
export const dataLoadingErrorId = `${prefix}-data-loading-error`;
export const noResumesMsgId = `${prefix}-no-resumes`;
export const createNewResumeId = `${prefix}-create-new-resume`;
export const createClonedResumeId = `${prefix}-create-cloned-resume`;
export const titleInputId = `${prefix}-title-input`;
export const createNewResumeSubmitBtnId = `${prefix}-create-new-resume-submit`;
export const deleteSuccessMsgId = `${prefix}-delete-success`;
export const confirmDeleteMsgId = `${prefix}-confirm-delete`;
export const descriptionInputId = `${prefix}-description-input`;
export const domRowTitleClass = `${prefix}-title`;
export const domUpdateUITriggerClassname = `${prefix}-update-ui-trigger`;

export function makeResumeRowId(id: Id) {
  return `${prefix}-${id}`;
}

export function makeGoToEditResumeId(id: Id) {
  return `${prefix}-edit-${id}`;
}

export function makeYesConfirmDeleteId(id: Id) {
  return `${prefix}-yes-confirm-delete-${id}`;
}

export function makeDeleteId(id: Id) {
  return `${prefix}-delete-${id}`;
}

export function makeNoConfirmDeleteId(id: Id) {
  return `${prefix}-no-confirm-delete-${id}`;
}

export function makeTriggerCloneId(id: Id) {
  return `${prefix}-trigger-clone-${id}`;
}

export function makeShowUpdateResumeUITriggerBtnId(id: Id) {
  return `${prefix}-update-trigger-btn-${id}`;
}

export function makeResumeRowTitleContainerId(id: Id) {
  return `${prefix}-row-title-container-${id}`;
}

export function makeResumeRowTitleId(id: Id) {
  return `${prefix}-row-title-${id}`;
}

type Id = string | number;
