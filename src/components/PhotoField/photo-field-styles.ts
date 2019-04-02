import styled, { css } from "styled-components/macro";

import { visuallyHidden } from "../../styles/mixins";

const Main = styled.div`
  width: 170px;
  height: 170px;
  margin: 0 auto;
`;

export const FileChooser = styled(Main)`
  border: 4px dashed #d2d2d2;
`;

export const Thumb = styled(Main)`
  background-image: ${({ url }: { url: string }) => url};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;

export const EditorContainer = styled.div`
  opacity: 1;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s linear;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  display: flex;
`;

const BtnPhoto = css`
  cursor: pointer;
  width: 150px;
  margin: 0 auto;
  border: 2px solid #fff;
  border-radius: 2px;
  box-sizing: border-box;
  text-align: center;
  padding: 6px 12px;
  transition: border-color 0.2s linear;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
`;

export const ChangePhoto = styled.label`
  ${BtnPhoto}
  display: block;
  margin-bottom: 10px;
`;

export const UploadPhotoIconWrap = styled.div`
  color: #bcbdbd;
  margin: 10px auto;
  text-align: center;
  display: block;
  overflow: hidden;
  height: 50px;
  font-size: 1.5rem;
`;

export const InputFile = styled.input.attrs({
  type: "file",
  accept: "image/*"
})`
  ${visuallyHidden}
`;
