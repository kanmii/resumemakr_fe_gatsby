import { FieldProps } from "formik";

export interface Props extends FieldProps<{ photo: string | null }> {
  removeFilePreview?: () => void;
}

export enum PhotoFieldState {
  previewing = "previewing",
  clean = "clean",
  touched = "touched",
  deleted = "deleted"
}

export const uiTexts = {
  uploadPhotoText: "Upload Photo",

  deletePhotoText: "Remove",

  changePhotoText: "Change photo",

  deletePhotoConfirmationText: "Do you really want to remove photo?",

  dialogHeader: "Removing photo",

  negativeToRemovePhotoText: "No",

  positiveToRemovePhotoText: "Yes"
};
